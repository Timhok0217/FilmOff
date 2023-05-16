import React, { useRef, useState } from 'react'
import styles from './Registration.module.css'
import { useNavigate } from 'react-router-dom'

import { auth, db } from '../../config/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { collection, addDoc } from 'firebase/firestore'

const Registration = () => {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const nicknameRef = useRef<HTMLInputElement>(null)
  const password2Ref = useRef<HTMLInputElement>(null)
  const [isShowFilms, setIsShowFilms] = useState(false)
  const navigate = useNavigate()
  const userRef = collection(db, 'users')

  const [mistake, setMistake] = useState('')

  const addUserToCollection = async (
    userUid: string | undefined,
    email: string,
    nickname: string,
    isShowFilms: boolean
  ) => {
    try {
      await addDoc(userRef, {
        idUser: userUid,
        email,
        nickname,
        isShowFilms,
      })
    } catch (error) {
      console.error('Error add user:', error)
    }
  }

  const handleFormSubmit = async () => {
    const email = emailRef.current?.value
    const password = passwordRef.current?.value
    const password2 = password2Ref.current?.value
    const nickname = nicknameRef.current?.value

    if (!email || !password || !password2 || !nickname) {
      setMistake('Пожалуйста, заполните все поля')
      return
    }

    if (password.length < 6 || password2.length < 6) {
      setMistake('Пароль не менее 6 символов!')
      return
    }

    if (nickname.length < 6) {
      setMistake('Никнейм не менее 6 символов!')
      return
    }

    if (password !== password2) {
      setMistake('Пароли не совпадают!')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      setMistake('Неверный формат email-адреса!')
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email!,
        password!
      )
      await updateProfile(userCredential.user, { displayName: nickname! })

      await addUserToCollection(
        auth.currentUser?.uid,
        email!,
        nickname!,
        isShowFilms
      )
      navigate(`/profile/${auth.currentUser?.uid}`)
    } catch (error: any) {
      setMistake('Ошибка, e-mail уже зарегистрирован!')
    }
  }
  return (
    <div className={styles.form}>
      <div className={styles.formBox}>
        <div className={styles.mail}>
          <label htmlFor="text">Никнейм:</label>
          <input
            type="text"
            id="text"
            name="text"
            placeholder="Введите никнейм"
            className={styles.input}
            ref={nicknameRef}
          />
        </div>
        <div className={styles.mail}>
          <label htmlFor="email">Логин:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Введите e-mail"
            className={styles.input}
            ref={emailRef}
          />
        </div>
        <div className={styles.mail}>
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Введите пароль"
            className={styles.input}
            ref={passwordRef}
          />
        </div>
        <div className={styles.mail}>
          <label htmlFor="password2">Повторите пароль:</label>
          <input
            type="password"
            id="password2"
            name="password2"
            placeholder="Повторите пароль"
            className={styles.input}
            ref={password2Ref}
          />
        </div>
        <div className={styles.mailCheck}>
          <label htmlFor="showFilms" className={styles.labelCheckBox}>
            Отображать сохраненное для других пользователей
          </label>
          <input
            type="checkbox"
            id="showFilms"
            name="showFilms"
            className={styles.checkbox}
            checked={isShowFilms}
            onChange={(e) => setIsShowFilms(e.target.checked)}
          />
        </div>
        {mistake && <div>{mistake}</div>}
        <div className={styles.buttonDiv}>
          <button
            type="button"
            className={styles.button}
            onClick={handleFormSubmit}
          >
            Регистрация
          </button>
        </div>
      </div>
    </div>
  )
}

export default Registration
