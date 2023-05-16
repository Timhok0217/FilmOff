import React, { useEffect, useState } from 'react'
import styles from './MyContent.module.css'

import SavedFilmTable from '../SavedFilmTable/SavedFilmTable'
import SavedVoteTable from '../SavedVoteTable/SavedVoteTable'

import { db } from '../../config/firebase'
import { auth } from '../../config/firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
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
  idDoc: string
}

const MyContent = () => {
  const savedFilmsRef = collection(db, 'savedFilms')
  const voteFilmsRef = collection(db, 'voteFilms')

  const [savedFilms, setSavedFilms] = useState<SavedFilm[]>([])
  const [voteFilms, setVoteFilms] = useState<VoteFilm[]>([])

  const [dataLoaded, setDataLoaded] = useState(true)
  const [sortOrder, setSortOrder] = useState(true)

  const [showTable, setShowTable] = useState(true)

  const toggleTable = () => {
    setShowTable((prev) => !prev)
  }

  const toggleSortOrder = () => {
    setSortOrder((prev) => !prev)
  }

  const filterVotes = () => {
    let sortedFilms
    if (sortOrder) {
      sortedFilms = [...voteFilms].sort(
        (a, b) => Number(a.vote) - Number(b.vote)
      )
    } else {
      sortedFilms = [...voteFilms].sort(
        (a, b) => Number(b.vote) - Number(a.vote)
      )
    }
    setVoteFilms(sortedFilms)
  }

  useEffect(() => {
    filterVotes()
  }, [sortOrder])

  useEffect(() => {
    if (savedFilms.length > 0 || voteFilms.length > 0) {
      setDataLoaded(false)
    }
  }, [savedFilms, voteFilms])

  useEffect(() => {
    const unsubscribeSavedFilms = onSnapshot(
      query(savedFilmsRef, where('userId', '==', auth.currentUser?.uid)),
      (snapshot) => {
        const films = snapshot.docs.map(
          (doc) => ({ idDoc: doc.id, ...doc.data() } as SavedFilm)
        )
        setSavedFilms(films)
        setDataLoaded(false)
      }
    )

    const unsubscribeVoteFilms = onSnapshot(
      query(voteFilmsRef, where('userId', '==', auth.currentUser?.uid)),
      (snapshot) => {
        const votes = snapshot.docs.map(
          (doc) => ({ idDoc: doc.id, ...doc.data() } as VoteFilm)
        )
        //Сортируем список по возрастанию
        const sortedFilms = [...votes].sort(
          (a, b) => Number(a.vote) - Number(b.vote)
        )

        setVoteFilms(sortedFilms)
        setDataLoaded(false)
      }
    )

    return () => {
      unsubscribeSavedFilms()
      unsubscribeVoteFilms()
    }
  }, [])

  return (
    <>
      <div className={styles.page}>
        <div className={styles.header}>Мое</div>

        {dataLoaded ? (
          <div className={styles.loader}>
            <div className={styles.loaderimg} />
          </div>
        ) : (
          savedFilms.length === 0 &&
          voteFilms.length === 0 && (
            <div className={styles.none}>
              Вы еще ничего не оценили и не сохранили!
            </div>
          )
        )}

        {savedFilms.length > 0 && (
          <>
            <button onClick={toggleTable} className={styles.buttonTable}>
              {showTable ? 'Скрыть сохраненное' : 'Показать сохраненное'}
            </button>
            {showTable && (
              <div className={styles.mainWatched}>
                <div className={styles.headerBlock}>Сохраненное</div>
                <div className={styles.bodyWatched}>
                  <div className={styles.tableWatched}>
                    {savedFilms.map(
                      (item: { id: React.Key | null | undefined }) => (
                        <div key={item.id}>
                          <SavedFilmTable films={item} />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {voteFilms.length > 0 && (
          <div className={styles.mainVote}>
            <div className={styles.headerBlock}>
              Оценки
              <div
                className={sortOrder ? styles.filterDown : styles.filterUp}
                onClick={toggleSortOrder}
              ></div>
            </div>
            <div className={styles.bodyVote}>
              <div className={styles.tableVote}>
                {voteFilms.map(
                  (
                    item: { id: React.Key | null | undefined },
                    index: number
                  ) => (
                    <div key={item.id}>
                      <SavedVoteTable votes={item} index={index} />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default MyContent
