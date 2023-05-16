import React, { useState } from 'react'
import styles from './Login.module.css'

interface Props {
  onLogin: (login: string, password: string) => void
  mistake: string
}

const Login: React.FC<Props> = ({ onLogin, mistake }) => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    onLogin(login, password)
  }

  return (
    <div className={styles.form}>
      <div className={styles.formBox}>
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
        <div className={styles.buttonDiv}>
          <button
            type="submit"
            onClick={handleSubmit}
            className={styles.button}
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
