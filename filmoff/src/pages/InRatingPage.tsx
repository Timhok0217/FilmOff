import React, { useEffect, useState } from 'react'
import styles from './styles/InRatingPage.module.css'

import { db } from '../config/firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import RatingFilms from '../components/RatingFilms/RatingFilms'
import RatingVotes from '../components/RatingVotes/RatingVotes'

interface SavedFilm {
  id: string
  image?: string | null
  title: string
  userId: string
  idDoc: string
  count?: number
}

interface VoteFilm {
  id: string
  image?: string | null
  title: string
  vote?: string
  userId: string
  idDoc: string
}

const InRatingPage = () => {
  const savedFilmsRef = collection(db, 'savedFilms')
  const voteFilmsRef = collection(db, 'voteFilms')

  const [savedFilms, setSavedFilms] = useState<SavedFilm[]>([])
  const [voteFilms, setVoteFilms] = useState<VoteFilm[]>([])

  const [dataLoaded, setDataLoaded] = useState(true)

  const [showFilms, setShowFilms] = useState(true)
  const [showVote, setShowVote] = useState(false)

  const handleLoginClick = () => {
    setShowFilms(true)
    setShowVote(false)
  }

  const handleRegistrationClick = () => {
    setShowFilms(false)
    setShowVote(true)
  }

  useEffect(() => {
    if (savedFilms.length > 0 || voteFilms.length > 0) {
      setDataLoaded(false)
    }
  }, [savedFilms, voteFilms])

  useEffect(() => {
    const unsubscribeSavedFilms = onSnapshot(savedFilmsRef, (snapshot) => {
      const films = snapshot.docs.map(
        (doc) => ({ idDoc: doc.id, ...doc.data() } as SavedFilm)
      )
      const sortedFilms = films.reduce((acc, film) => {
        const existingFilm = acc.find((f) => f.id === film.id)
        if (existingFilm) {
          existingFilm.count = existingFilm.count ? existingFilm.count + 1 : 1
        } else {
          acc.push({ ...film, count: 1 })
        }
        return acc
      }, [] as SavedFilm[])

      sortedFilms.sort((a, b) => (b.count || 0) - (a.count || 0))

      setSavedFilms(sortedFilms)
      setDataLoaded(false)
    })

    const unsubscribeVoteFilms = onSnapshot(voteFilmsRef, (snapshot) => {
      const votes = snapshot.docs.map(
        (doc) => ({ idDoc: doc.id, ...doc.data() } as VoteFilm)
      )
      const voteMap: { [key: string]: { votes: number[]; films: VoteFilm[] } } =
        {}

      votes.forEach((vote) => {
        if (voteMap[vote.id]) {
          voteMap[vote.id].votes.push(Number(vote.vote))
          voteMap[vote.id].films.push(vote)
        } else {
          voteMap[vote.id] = { votes: [Number(vote.vote)], films: [vote] }
        }
      })

      const filteredVotes = Object.keys(voteMap).map((filmId) => {
        const { votes: votesForFilm, films } = voteMap[filmId]
        const aver =
          votesForFilm.reduce((total, vote) => total + vote, 0) /
          votesForFilm.length
        const averageVote = Number.isInteger(aver) ? aver : aver.toFixed(1) //Округляем дроби
        const film = films[0] //Выбираем любой фильм из массива
        return {
          ...film,
          averVote: averageVote.toString(),
          voteCount: films.length,
        }
      })

      filteredVotes.sort((a, b) => Number(b.averVote) - Number(a.averVote))

      setVoteFilms(filteredVotes)
      setDataLoaded(false)
    })

    return () => {
      unsubscribeSavedFilms()
      unsubscribeVoteFilms()
    }
  }, [])

  return (
    <>
      <div className={styles.page}>
        <div className={styles.header}>Рейтинги</div>

        {dataLoaded ? (
          <div className={styles.loader}>
            <div className={styles.loaderimg} />
          </div>
        ) : (
          <div className={styles.body}>
            <div className={styles.choose}>
              <button
                className={showFilms ? styles.active : ''}
                onClick={handleLoginClick}
              >
                Топ сохраненных
              </button>
              <button
                className={showVote ? styles.active : ''}
                onClick={handleRegistrationClick}
              >
                Топ оценок
              </button>
            </div>
            <div className={styles.choosing}>
              {showFilms && (
                <div className={styles.mainFilms}>
                  {savedFilms.map((item, index) => (
                    <div key={item.id}>
                      <RatingFilms film={item} pos={index} />
                    </div>
                  ))}
                </div>
              )}
              {showVote && (
                <div className={styles.mainFilms}>
                  {voteFilms.map((item, index) => (
                    <div key={item.id}>
                      <RatingVotes votes={item} pos={index} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default InRatingPage
