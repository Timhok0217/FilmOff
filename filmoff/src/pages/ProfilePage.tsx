import React, { useState, useEffect } from 'react'
import Login from '../components/Login/Login'
import Registration from '../components/Registration/Registration'
import styles from './styles/ProfilePage.module.css'
import Profile from '../components/Profile/Profile'
import { useNavigate } from 'react-router-dom'

interface User {
  id: number
  login: string
  password: string
  nickname: string
  savedFilms: number
  savedFilmsList: Film[]
  vote: number
  voteList: Vote[]
  comments: number
}

interface Film {
  id: string
  image: string
}

interface Vote {
  id: string
  image: string
  vote: number
}

interface Props {
  user: User
  loggedIn: boolean
  handleLogout: () => void
  onLoginStatusChange: (status: boolean) => void
}

const ProfilePage: React.FC<Props> = ({
  user,
  loggedIn,
  handleLogout,
  onLoginStatusChange,
}) => {
  const [showLogin, setShowLogin] = useState(true)
  const [showRegistration, setShowRegistration] = useState(false)

  const [mistake, setMistake] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('login')!)
    if (user) {
      onLoginStatusChange(true)
    }
  }, [])

  function handleLoginClick() {
    setShowLogin(true)
    setShowRegistration(false)
  }

  const handleRegistrationClick = () => {
    setShowLogin(false)
    setShowRegistration(true)
  }

  const handleLogin = (login: string, password: string) => {
    if (login === user.login && password === user.password) {
      onLoginStatusChange(true)
      localStorage.setItem('login', JSON.stringify(user))
      setMistake('')
      navigate(`/profile/${user.id}`)
    } else {
      setMistake('Неверный логин или пароль')
    }
  }

  return (
    <>
      {loggedIn ? (
        <div className={styles.page}>
          <Profile user={user} handleLogout={handleLogout} />
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
          <div className="flex justify-center">
            {showLogin && <Login onLogin={handleLogin} mistake={mistake} />}
            {showRegistration && <Registration />}
          </div>
        </div>
      )}
    </>
  )
}

export default ProfilePage
