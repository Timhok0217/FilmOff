import React, { useEffect, useState } from 'react'

import styles from './SavedVoteTable.module.css'
import { Link } from 'react-router-dom'

import { db } from '../../config/firebase'
import { auth } from '../../config/firebase'
import {
  collection,
  getDocs,
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

const SavedVoteTable = ({ votes, index }: any) => {
  const voteFilmsRef = collection(db, 'voteFilms')

  const [voteFilms, setVoteFilms] = useState<VoteFilm[]>([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [hoveredStars, setHoveredStars] = useState(0)
  const [zahod, setZahod] = useState(true)

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

  const handleStarHover = (value: number) => {
    setZahod(false)
    setHoveredStars(value)
  }

  const handleMouseLeave = () => {
    if (votes.vote) {
      setHoveredStars(Number(votes.vote))
    } else {
      setHoveredStars(0)
    }
    setZahod(true)
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
      <div className="text-2xl w-[27px]">{index + 1}</div>

      <div className={styles.movie}>
        <div className={styles.moviecard}>
          <div className={styles.header}>{votes.title}</div>
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

        <div className={styles.movieUserRating} onMouseLeave={handleMouseLeave}>
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
                hoveredStars > 0 && hoveredStars >= value ? styles.hovered : ''
              }`}
            >
              <div className={styles.val}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SavedVoteTable
