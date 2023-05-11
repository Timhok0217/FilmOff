import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './SavedFilmTable.module.css'

const SavedFilmTable = ({ films }: any) => {
  const [save, setSave] = useState(true)

  const handleSave = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setSave((prev) => !prev)
  }
  return (
    <>
      {save && (
        <div className={styles.moviecard}>
          <div className={styles.moviewrapper}>
            <Link to={`/cardFilm/${films.id}`} className={styles.movieurl}>
              <img
                className={styles.movieposter}
                src={`${films.image}`}
                alt="poster"
              />
              <div className={styles.moviedescription}>
                <div className={styles.movierating}>
                  <div className={styles.boxUser}>
                    <div className={styles.movieSave} onClick={handleSave}>
                      <div className={styles[save ? 'unsave' : 'save']}></div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default SavedFilmTable
