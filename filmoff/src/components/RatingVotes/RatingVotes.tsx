import React, { useEffect, useState } from 'react'
import styles from './RatingVotes.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { db } from '../../config/firebase'
import { auth } from '../../config/firebase'
import {
  collection,
  getDocs,
  addDoc,
  doc,
  query,
  where,
  updateDoc,
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

interface VoteFilm {
  id: string
  image?: string | null
  title: string
  vote?: string
  userId: string
  idDoc: string
}

const RatingVotes = ({ votes, pos }: any) => {
  const voteFilmsRef = collection(db, 'voteFilms')

  const navigate = useNavigate()

  const [voteFilms, setVoteFilms] = useState<VoteFilm[]>([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [hoveredStars, setHoveredStars] = useState(0)
  const [zahod, setZahod] = useState(true)
  const [voteEdit, setVoteEdit] = useState(false)

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const fetchDBVoteFilms = async () => {
    const userId = auth.currentUser?.uid
    if (userId) {
      const q = query(
        voteFilmsRef,
        where('userId', '==', userId),
        where('id', '==', votes.id)
      )
      const queryDateDB = await getDocs(q)
      const vot = queryDateDB.docs.map(
        (doc) => ({ idDoc: doc.id, ...doc.data() } as VoteFilm)
      )
      setVoteFilms(vot)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchDBVoteFilms()
      }
    })

    return unsubscribe
  }, [])

  const handleYourRatClick = () => {
    const user = auth.currentUser
    if (!user) {
      navigate('/profile')
    } else {
      setVoteEdit(true)
    }
  }

  const handleStarHover = (value: number) => {
    setZahod(false)
    setHoveredStars(value)
    setVoteEdit(true)
  }

  const handleMouseLeave = () => {
    if (votes.vote) {
      setHoveredStars(Number(votes.vote))
    } else {
      setHoveredStars(0)
    }
    setZahod(true)
    setVoteEdit(false)
  }

  const handleVoteSubmit = async (value: number) => {
    const userId = auth.currentUser?.uid
    if (userId) {
      const voteDoc = voteFilms.find((voteFilm) => voteFilm.userId === userId)
      if (voteDoc) {
        const updatedVoteFilms = voteFilms.map((voteFilm) =>
          voteFilm.userId === userId
            ? { ...voteFilm, vote: `${value}` }
            : voteFilm
        )
        setVoteFilms(updatedVoteFilms)
        setIsUpdating(true)
      } else {
        const newVoteFilm = {
          userId: userId,
          id: votes.id,
          vote: `${value}`,
          title: votes.title,
          image: votes.image,
          idDoc: '',
        }
        const docRef = await addDoc(voteFilmsRef, {
          userId: userId,
          id: votes.id,
          vote: `${value}`,
          title: votes.title,
          image: votes.image,
        })
        newVoteFilm.idDoc = docRef.id
        setVoteFilms([...voteFilms, newVoteFilm])
        setIsUpdating(true)
      }
    }
  }

  const updateVotesInDB = async () => {
    const userId = auth.currentUser?.uid
    if (userId) {
      const voteDoc = voteFilms.find((voteFilm) => voteFilm.userId === userId)
      if (voteDoc) {
        const voteDocRef = doc(db, 'voteFilms', voteDoc.idDoc)
        await updateDoc(voteDocRef, { vote: voteDoc.vote })
      }
    }
  }

  useEffect(() => {
    if (isUpdating) {
      updateVotesInDB().then(() => {
        setIsUpdating(false)
      })
    }
  }, [isUpdating])

  return (
    <div className={styles.page}>
      <div className={styles.table}>
        <div className={styles.index}>{pos + 1}</div>

        <div className={styles.gridIt}>
          <div className={styles.moviecard}>
            <div className={styles.moviewrapper}>
              <Link to={`/cardFilm/${votes.id}`} className={styles.movieurl}>
                <img
                  className={styles.movieposter}
                  src={`${votes.image}`}
                  alt="poster"
                />
              </Link>
            </div>
          </div>

          <div className={styles.info}>
            <div className={styles.title}>{votes.title}</div>
            {!voteEdit ? (
              <div className={styles.boxInfo}>
                <div className={styles.infoLine}>
                  <div>Рейтинг</div>
                  <div className={styles.rat}>
                    <div className={styles.count}>{votes?.averVote}</div>
                  </div>
                </div>

                <div className={styles.infoLine}>
                  <div>Оценить</div>

                  <div className={styles.rating}>
                    <div
                      className={`${styles.yourRat} ${
                        isMounted ? styles.saveMounted : ''
                      }`}
                      onClick={handleYourRatClick}
                    >
                      <div className={styles.countYourVote}>
                        <div className={styles.voteText}>
                          {voteFilms[0]?.vote}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.boxInfo}>
                <div className={styles.infoLine}>
                  <div>Оценка</div>
                  <div
                    className={styles.movieUserRating}
                    onMouseLeave={handleMouseLeave}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <div
                        key={value}
                        onMouseEnter={() => handleStarHover(value)}
                        onClick={() => handleVoteSubmit(value)}
                        className={`${styles.star} ${
                          votes.vote && Number(votes.vote) >= value && zahod
                            ? styles.filled
                            : ''
                        } ${
                          hoveredStars > 0 && hoveredStars >= value
                            ? styles.hovered
                            : ''
                        }`}
                      >
                        <div className={styles.val}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RatingVotes
