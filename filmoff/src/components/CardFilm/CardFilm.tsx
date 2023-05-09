import React, { useState } from 'react'
import styles from './CardFilm.module.css'
import { Link } from 'react-router-dom'

const CardFilm = ({ cardProps, isLoading }: any) => {
  const [movieSave, setMovieSave] = useState(false)
  const cardImg = cardProps.image
    ? cardProps?.image.replace(
        /_V1_[A-Z]+(\d+)_CR\d+,\d+,(\d+),(\d+)_/,
        `_V1_UX${1000},CR0,0,${400}_`
      )
    : null

  const handleRatingClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    console.log('Rating clicked')
  }

  const handleFilmClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setMovieSave((prev) => !prev)
    event.preventDefault()
  }

  return (
    <div className={styles.moviecard}>
      <div className={styles.moviewrapper}>
        <Link to={`/cardFilm/${cardProps.id}`} className={styles.movieurl}>
          {isLoading ? (
            <div className={styles.loader}>
              <div className={styles.loaderimg} />
            </div>
          ) : (
            <img
              className={styles.movieposter}
              src={`${cardImg}`}
              alt="poster"
            />
          )}
          <div className={styles.moviedescription}>
            {cardProps.imDbRating && (
              <div className={styles.movierating}>
                <div className={styles.movieImdbRating}>
                  {cardProps.imDbRating}
                </div>

                <div className={styles.boxUser}>
                  <div className={styles.movieSave} onClick={handleFilmClick}>
                    <div
                      className={styles[movieSave ? 'unsave' : 'save']}
                    ></div>
                  </div>

                  <div
                    className={styles.movieUserRating}
                    onClick={handleRatingClick}
                  ></div>
                </div>
              </div>
            )}
            <h3 className={styles.movietitle}>{cardProps.title}</h3>
            <footer className={styles.moviefooter}>
              <div className={styles.moviecrew}>
                {cardProps.crew
                  ? cardProps.crew.split(',')[0]
                  : cardProps.genres
                  ? cardProps.genres
                  : null}
              </div>
              <div className={styles.movieyear}>
                {cardProps?.year ||
                  (cardProps.description &&
                    cardProps?.description.match(/\d+/g)[0])}
              </div>
            </footer>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default CardFilm
