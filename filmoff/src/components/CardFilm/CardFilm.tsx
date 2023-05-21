import React, { useEffect, useState } from 'react'
import styles from './CardFilm.module.css'
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

interface Props {
  cardProps: CardProps | null
  isLoading: boolean
}

interface SavedFilm {
  id: string
  image?: string | null
  title: string
  userId: string
  idDoc: string
}

interface VoteFilm {
  id: string
  image?: string | null
  title: string
  vote?: string
  userId: string
  idDoc?: string
}

const CardFilm = ({ cardProps, isLoading }: Props) => {
  const savedFilmsRef = collection(db, 'savedFilms')
  const voteFilmsRef = collection(db, 'voteFilms')

  const navigate = useNavigate()
  const [movieSave, setMovieSave] = useState(false)
  const [savedFilms, setSavedFilms] = useState<SavedFilm[]>([])

  const [votes, setVotes] = useState<VoteFilm>({
    id: '',
    vote: '',
    title: '',
    image: '',
    userId: '',
    idDoc: '',
  })

  const cardImg = cardProps?.image
    ? cardProps?.image.replace(
        /_V1_[A-Z]+(\d+)_CR\d+,\d+,(\d+),(\d+)_/,
        `_V1_UX${1000},CR0,0,${400}_`
      )
    : null

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

  const fetchDBVoteFilms = async () => {
    const userId = auth.currentUser?.uid
    if (userId) {
      const q = query(voteFilmsRef, where('userId', '==', userId))
      const queryDateDB = await getDocs(q)
      const votes = queryDateDB.docs.map(
        (doc) =>
          ({
            idDoc: doc.id,
            ...doc.data(),
          } as VoteFilm)
      )
      const voteDoc = votes.find((vote) => vote.id === cardProps?.id)
      setVotes(
        voteDoc || {
          id: '',
          vote: '',
          title: '',
          image: '',
          userId: '',
          idDoc: '',
        }
      )
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchDBSavedFilms()
        fetchDBVoteFilms()
      }
    })

    return unsubscribe
  }, [cardProps])

  useEffect(() => {
    const savedFilm = savedFilms.find((film) => film.id === cardProps?.id)
    if (savedFilm) {
      setMovieSave(true)
    } else {
      setMovieSave(false)
    }
  }, [savedFilms, cardProps])

  const handleFilmClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    setMovieSave((prev) => !prev)
    e.preventDefault()

    const userId = auth.currentUser?.uid

    if (!userId) {
      navigate('/profile')
      return
    }

    const savedFilm = savedFilms.find((film) => film.id === cardProps?.id)

    // Добавление фильма в коллекцию
    if (!movieSave) {
      try {
        await addDoc(savedFilmsRef, {
          id: cardProps?.id,
          image: cardProps?.image,
          title: cardProps?.title,
          userId: auth?.currentUser?.uid,
        })
        await fetchDBSavedFilms()
      } catch (error) {
        console.error('Error save:', error)
      }
    } else {
      if (movieSave && savedFilm) {
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
    <div className={styles.moviecard}>
      <div className={styles.moviewrapper}>
        <Link to={`/cardFilm/${cardProps?.id}`} className={styles.movieurl}>
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
            {
              <div className={styles.movierating}>
                <div className={styles.imdb}>
                  <div className={styles.imdbText}>IMDB</div>
                  <div className={styles.movieImdbRating}>
                    {cardProps?.imDbRating || null}
                  </div>
                </div>

                <div className={styles.boxUser}>
                  <div className={styles.movieUserRating}>{votes.vote}</div>

                  <div className={styles.movieSave} onClick={handleFilmClick}>
                    <div
                      className={styles[movieSave ? 'unsave' : 'save']}
                    ></div>
                  </div>
                </div>
              </div>
            }
            <h3 className={styles.movietitle}>{cardProps?.title}</h3>
            <footer className={styles.moviefooter}>
              <div className={styles.moviecrew}>
                {cardProps?.crew
                  ? cardProps.crew.split(',')[0]
                  : cardProps?.genres
                  ? cardProps.genres
                  : null}
              </div>
              <div className={styles.movieyear}>
                {cardProps?.year ||
                  (cardProps?.description &&
                    cardProps?.description.match(/\d+/g)?.[0])}
              </div>
            </footer>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default CardFilm
