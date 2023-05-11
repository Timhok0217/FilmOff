import React from 'react'
import CardFilm from '../CardFilm/CardFilm'
import styles from './CardTable.module.css'

interface CardProps {
  id: string
  image?: string | null
  imDbRating?: number
  title: string
  crew?: string
  genres?: string
  year?: string
  description?: string | null
}

interface CardTableProps {
  popularFilms: CardProps[]
  isLoading: boolean
}

const CardTable: React.FC<CardTableProps> = ({ popularFilms, isLoading }) => {
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
