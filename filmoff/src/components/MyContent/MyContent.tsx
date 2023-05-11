import React from 'react'
import styles from './MyContent.module.css'

import SavedFilmTable from '../SavedFilmTable/SavedFilmTable'
import SavedVoteTable from '../SavedVoteTable/SavedVoteTable'

interface UserProps {
    id: number
    login: string
    password: string
    nickname: string
    savedFilms: number
    savedFilmsList: FilmProps[]
    vote: number
    voteList: VoteProps[]
    comments: number
  }
  
  interface FilmProps {
    id: string
    image: string
  }
  
  interface VoteProps {
    id: string
    image: string
    vote: number
  }
  
  interface MyContentProps {
    user: UserProps
  }
  
  const MyContent: React.FC<MyContentProps> = ({ user }) => {
  return (
    <>
        <div className={styles.page}>
            <div className={styles.header}>Мое</div>

            <div className={styles.mainWatched}>
                <div className={styles.headerBlock}>Сохраненное</div>
                <div className={styles.bodyWatched}>
                    {user.savedFilmsList && <div className={styles.tableWatched}>
                        {user.savedFilmsList.map((item: { id: React.Key | null | undefined }) => 
                            <div key={item.id}>
                                <SavedFilmTable films={item}/>
                            </div>
                        )}
                    </div>}
                </div>
            </div>

            <div className={styles.mainVote}>
                <div className={styles.headerBlock}>Оценки</div>
                <div className={styles.bodyVote}>
                    <div className={styles.tableVote}>
                        {user.voteList.map((item: { id: React.Key | null | undefined }, index: number) => 
                            <div key={item.id}>
                                <SavedVoteTable votes={item} index={index}/>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    </>
    
  )
}

export default MyContent