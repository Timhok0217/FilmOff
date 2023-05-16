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
  const [vote, setVote] = useState(votes.vote)
  const [isEditing, setIsEditing] = useState(false)
  const [prevVote, setPrevVote] = useState(votes.vote)

  const fetchDBVoteFilms = async () => {
    const userId = auth.currentUser?.uid
    if (userId) {
      const q = query(voteFilmsRef, where('userId', '==', userId))
      const queryDateDB = await getDocs(q)
      const votes = queryDateDB.docs.map(
        (doc) => ({ idDoc: doc.id, ...doc.data() } as VoteFilm)
      )
      setVoteFilms(votes)
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

  const handleVoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVote(e.target.value)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (vote !== prevVote) {
      setPrevVote(vote)
      const voteDocRef = doc(db, 'voteFilms', votes.idDoc)
      try {
        updateDoc(voteDocRef, { vote: vote })
      } catch (error) {
        console.error('Error updt BD: ', error)
      }
    }
  }

  const handleVoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsEditing(false)
    setPrevVote(vote)
    if (vote !== prevVote) {
      const voteDocRef = doc(db, 'voteFilms', votes.idDoc)
      try {
        await updateDoc(voteDocRef, { vote: vote })
      } catch (error) {
        console.error('Error updt BD: ', error)
      }
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  return (
    <div className={styles.page}>
      <div>{index + 1}</div>

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

      <div
        className={
          isEditing ? styles.movieUserRatingEdit : styles.movieUserRating
        }
        onClick={handleEditClick}
      >
        {isEditing ? (
          <form onSubmit={handleVoteSubmit}>
            <input
              type="number"
              value={vote}
              onChange={handleVoteChange}
              onBlur={handleBlur}
              min={1}
              max={10}
              step={0.5}
              autoFocus
              className={styles.input}
            />
          </form>
        ) : (
          vote
        )}
      </div>
    </div>
  )
}

export default SavedVoteTable
