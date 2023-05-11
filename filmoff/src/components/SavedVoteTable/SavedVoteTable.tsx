import React, { useState } from 'react'

import styles from './SavedVoteTable.module.css'
import { Link } from 'react-router-dom'

const SavedVoteTable = ({ votes, index }: any) => {
  const [vote, setVote] = useState(votes.vote)
  const [isEditing, setIsEditing] = useState(false)
  const [prevVote, setPrevVote] = useState(votes.vote)

  const handleVoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVote(e.target.value)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (vote !== prevVote) {
      setVote(prevVote)
    }
  }

  const handleVoteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPrevVote(vote)
    setIsEditing(false)
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  return (
    <div className="flex items-center gap-4">
      <div>{index + 1}</div>

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
              className="text-black bg-gray-500 w-12 h-5"
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
