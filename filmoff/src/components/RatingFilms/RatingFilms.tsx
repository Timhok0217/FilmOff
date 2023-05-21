import React, { useEffect, useState } from 'react'
import styles from './RatingFilms.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { db } from '../../config/firebase'
import { auth } from '../../config/firebase'
import {
  collection,
  getDocs,
  addDoc,
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

const RatingFilms = ({ film, pos }: any) => {
  const savedFilmsRef = collection(db, 'savedFilms')

  const navigate = useNavigate()
  const [movieSave, setMovieSave] = useState(false)
  const [savedFilms, setSavedFilms] = useState<SavedFilm[]>([])

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const fetchDBSavedFilms = async () => {
    const userId = auth.currentUser?.uid
    if (userId) {
      const q = query(savedFilmsRef, where('userId', '==', userId))
      const queryDateDB = await getDocs(q)
      const films = queryDateDB.docs.map(
        (doc) => ({ idDoc: doc.id, ...doc.data() } as SavedFilm)
      )
      setMovieSave(films.some((item) => item.id === film?.id))
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
  }, [film])

  useEffect(() => {
    const savedFilm = savedFilms.find((item) => item.id === film?.id)
    if (savedFilm) {
      setMovieSave(true)
    } else {
      setMovieSave(false)
    }
  }, [savedFilms])

  const handleFilmClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    setMovieSave((prev) => !prev)
    e.preventDefault()

    const userId = auth.currentUser?.uid

    if (!userId) {
      navigate('/profile')
      return
    }

    const savedFilm = savedFilms.find((item) => item.id === film?.id)

    if (!movieSave) {
      try {
        await addDoc(savedFilmsRef, {
          id: film?.id,
          image: film?.image,
          title: film?.title,
          userId: auth?.currentUser?.uid,
        })
        await fetchDBSavedFilms()
      } catch (error) {
        console.error('Error save:', error)
      }
    } else {
      if (savedFilm) {
        try {
          const filmDoc = doc(db, 'savedFilms', savedFilm.idDoc)
          await deleteDoc(filmDoc)
          await fetchDBSavedFilms()
        } catch (error) {
          console.error('Error delet:', error)
        }
      }
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.table}>
        <div className={styles.index}>{pos + 1}</div>

        <div className={styles.gridIt}>
          <div className={styles.moviecard}>
            <div className={styles.moviewrapper}>
              <Link to={`/cardFilm/${film.id}`} className={styles.movieurl}>
                <img
                  className={styles.movieposter}
                  src={`${film.image}`}
                  alt="poster"
                />
              </Link>
            </div>
          </div>

          <div className={styles.info}>
            <div className={styles.title}>{film.title}</div>
            <div className={styles.boxInfo}>
              <div className={styles.infoLine}>
                <div>Количество добавлений</div>
                <div className={styles.rat}>
                  <div className={styles.count}>{film.count}</div>
                </div>
              </div>

              <div className={styles.infoLine}>
                <div>Сохранить</div>
                <div
                  className={`${styles.save} ${
                    isMounted ? styles.saveMounted : ''
                  } ${movieSave ? styles.unsave : ''}`}
                  onClick={handleFilmClick}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RatingFilms
