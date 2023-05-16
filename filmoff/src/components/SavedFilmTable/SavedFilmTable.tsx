import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import styles from './SavedFilmTable.module.css'

import { db } from '../../config/firebase'
import { auth } from '../../config/firebase'
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

interface SavedFilm {
  id: string
  image?: string | null
  title: string
  userId: string
  idDoc: string
}

const SavedFilmTable = ({ films }: any) => {
  const savedFilmsRef = collection(db, 'savedFilms')
  const [movieSave, setMovieSave] = useState(true)
  const [savedFilms, setSavedFilms] = useState<SavedFilm[]>([])
  const { id } = useParams<{ id?: string }>()

  const fetchDBSavedFilms = async () => {
    const userId = auth.currentUser?.uid
    if (userId) {
      const q = query(savedFilmsRef, where('userId', '==', userId))
      const queryDateDB = await getDocs(q)
      const films = queryDateDB.docs.map(
        (doc) => ({ idDoc: doc.id, ...doc.data() } as SavedFilm)
      )
      setSavedFilms(films)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchDBSavedFilms()
      }
    })

    return unsubscribe
  }, [])

  const handleFilmClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    setMovieSave((prev) => !prev)
    e.preventDefault()

    const savedFilm = savedFilms.find((film) => film.id === films?.id)

    if (movieSave && savedFilm) {
      try {
        const filmDoc = doc(db, 'savedFilms', savedFilm.idDoc)
        await deleteDoc(filmDoc)
        await fetchDBSavedFilms()
        setSavedFilms((prev) =>
          prev.filter((film) => film.idDoc !== savedFilm.idDoc)
        )
      } catch (error) {
        console.error('Error del film:', error)
      }
    }
  }

  return (
    <>
      {movieSave && (
        <div className={styles.moviecard}>
          <div className={styles.moviewrapper}>
            <Link to={`/cardFilm/${films.id}`} className={styles.movieurl}>
              <img
                className={styles.movieposter}
                src={`${films.image}`}
                alt="poster"
              />
              <div className={styles.moviedescription}>
                <div className={styles.title}>{films.title}</div>
                <div className={styles.movierating}>
                  {!id && (
                    <div className={styles.boxUser}>
                      <div
                        className={styles.movieSave}
                        onClick={handleFilmClick}
                      >
                        <div
                          className={styles[movieSave ? 'unsave' : 'save']}
                        ></div>
                      </div>
                    </div>
                  )}
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
