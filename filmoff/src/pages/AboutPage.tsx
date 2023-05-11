import React from 'react'
import styles from './styles/AboutPage.module.css'

const AboutPage = () => {
  return (
    <>
      <div className={styles.page}>
        <div className={styles.aboutBox}>
          <div>Работа выполнена Тимошевским Тимофеем!</div>
          <div>Для курса Тинькофф Frontend 2023!</div>
          <div>FilmOff - контент для приложения берется из IMDB-API!</div>
        </div>
      </div>
    </>
  )
}

export default AboutPage
