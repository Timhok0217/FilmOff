import React from 'react'

import styles from './Comment.module.css'
import { auth } from '../../config/firebase'
import { Link } from 'react-router-dom'

const Comment = ({ text, user, time, userId, onDelete }: any) => {
  return (
    <div className={styles.comment}>
      <div className={styles.header}>
        <div className={styles.time}>{time?.slice(0, 10)}</div>

        {userId === auth.currentUser?.uid && (
          <div className={styles.button}>
            <button onClick={onDelete} className={styles.button}></button>
          </div>
        )}
      </div>
      
      <div className={styles.nameTextBox}>
        <Link to={`/profile/${userId}`}>
          <div className={styles.user}>{user}</div>
        </Link>

        <div className={styles.text}>{text}</div>
      </div>
      
    </div>
  )
}

export default Comment
