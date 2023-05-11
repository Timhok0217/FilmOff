import React from 'react'
import styles from './Registration.module.css'

const Registration = () => {
  return (
    <div className={styles.form}>
      <form className={styles.formBox}>
        <div className={styles.mail}>
          <label htmlFor="text">Никнейм:</label>
          <input
            type="text"
            id="text"
            name="text"
            placeholder="Введите никнейм"
            className={styles.input}
          />
        </div>
        <div className={styles.mail}>
          <label htmlFor="email">Логин:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Введите логин"
            className={styles.input}
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
          />
        </div>
        <div className="flex justify-center items-center">
          <button type="submit" className={styles.button}>
            Регистрация
          </button>
        </div>
      </form>
    </div>
  )
}

export default Registration
