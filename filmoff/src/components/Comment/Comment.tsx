import React from 'react'

import styles from './Comment.module.css'

const Comment = ({ text, user, onDelete }: any) => {
  return (
    <div className={styles.comment}>
      <div className={styles.header}>
        <div>{user}</div>
        <div className={styles.button}>
          <button onClick={onDelete} className={styles.button}></button>
        </div>
      </div>

      <div>{text}</div>
    </div>
  )
}

export default Comment
