import React, { useState } from 'react'
import styles from './Login.module.css'

const Login = ({ onLogin, mistake }: any) => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    onLogin(login, password)
  }

  return (
    <div className={styles.form}>
      <form className={styles.formBox} onSubmit={handleSubmit}>
        <div className={styles.mail}>
          <label htmlFor="email">Логин:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Введите логин"
            className={styles.input}
            value={login}
            onChange={(event) => setLogin(event.target.value)}
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
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {mistake && <div>Неправильный логин или пароль!</div>}
        <div className="flex justify-center items-center">
          <button type="submit" className={styles.button}>
            Войти
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
