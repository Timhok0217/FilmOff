import React, { useState } from 'react'
import Login from '../components/Login/Login'
import Registration from '../components/Registration/Registration'
import styles from './styles/ProfilePage.module.css'
import Profile from '../components/Profile/Profile'
import { useNavigate } from 'react-router-dom'
import { auth } from '../config/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

interface Props {
  loggedIn: boolean
  handleLogout: () => void
  onLoginStatusChange: (status: boolean) => void
}

const ProfilePage: React.FC<Props> = ({
  loggedIn,
  handleLogout,
  onLoginStatusChange,
}) => {
  const [showLogin, setShowLogin] = useState(true)
  const [showRegistration, setShowRegistration] = useState(false)
  const [mistake, setMistake] = useState('')
  const navigate = useNavigate()

  const handleLoginClick = () => {
    setShowLogin(true)
    setShowRegistration(false)
  }

  const handleRegistrationClick = () => {
    setShowLogin(false)
    setShowRegistration(true)
  }

  const handleLogin = async (login: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, login, password)
      onLoginStatusChange(true)
      setMistake('')
      navigate(`/profile/${auth.currentUser?.uid}`)
    } catch (error) {
      setMistake('Неверный логин или пароль')
    }
  }

  return (
    <>
      {loggedIn ? (
        <div className={styles.page}>
          <Profile handleLogout={handleLogout} />
        </div>
      ) : (
        <div className={styles.page}>
          <div className={styles.choose}>
            <button
              className={showLogin ? styles.active : ''}
              onClick={handleLoginClick}
            >
              Вход
            </button>
            <button
              className={showRegistration ? styles.active : ''}
              onClick={handleRegistrationClick}
            >
              Регистрация
            </button>
          </div>
          <div className={styles.choosing}>
            {showLogin && <Login onLogin={handleLogin} mistake={mistake} />}
            {showRegistration && <Registration />}
          </div>
        </div>
      )}
    </>
  )
}

export default ProfilePage
