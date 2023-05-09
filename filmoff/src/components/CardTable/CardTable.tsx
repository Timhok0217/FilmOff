import React from 'react'
import CardFilm from '../CardFilm/CardFilm'
import styles from './CardTable.module.css'

const CardTable = ({ popularFilms, isLoading }: any) => {
  return (
    <div className={styles.table}>
      {popularFilms.map((item: any, index: number) => (
        <div key={index}>
          <CardFilm cardProps={item} isLoading={isLoading} />
        </div>
      ))}
    </div>
  )
}

export default CardTable
