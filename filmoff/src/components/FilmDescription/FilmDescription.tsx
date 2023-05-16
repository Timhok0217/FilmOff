import React, { useEffect, useState } from 'react'
import Comment from '../Comment/Comment'

import styles from './FilmDescription.module.css'

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
  updateDoc,
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

interface FilmInfo {
  id: string
  title: string
  fullTitle?: string
  year?: string
  image?: string
  genres?: string
  companies?: string
  countries?: string
  directors?: string
  imDbRating?: string
  metacriticRating?: string
  releaseDate?: string
  runtimeMins?: string
  stars?: string
}

interface Props {
  filmInfo: FilmInfo | null
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

const FilmDescription: React.FC<Props> = ({ filmInfo }) => {
  const savedFilmsRef = collection(db, 'savedFilms')
  const voteFilmsRef = collection(db, 'voteFilms')
  const commentsRef = collection(db, 'comments')

  const navigate = useNavigate()
  const [dataLoaded, setDataLoaded] = useState(true)

  const [movieSave, setMovieSave] = useState<boolean>(false)
  const [savedFilms, setSavedFilms] = useState<SavedFilm[]>([])

  const [comments, setComments] = useState<string[]>([])
  const [commentOpen, setCommentOpen] = useState<boolean>(false)
  const [commentDraft, setCommentDraft] = useState<string>('')

  const [votes, setVotes] = useState<VoteFilm>({
    id: '',
    vote: '',
    title: '',
    image: '',
    userId: '',
    idDoc: '',
  })
  const [isEditing, setIsEditing] = useState(false)

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
    if (userId && filmInfo?.id) {
      const q = query(
        voteFilmsRef,
        where('userId', '==', userId),
        where('id', '==', filmInfo.id)
      )
      try {
        const queryDateDB = await getDocs(q)
        const votes = queryDateDB.docs.map(
          (doc) =>
            ({
              idDoc: doc.id,
              ...doc.data(),
            } as VoteFilm)
        )
        setVotes(votes[0] || votes)
      } catch (error) {
        console.error('Error fetch:', error)
      }
    }
  }

  const getComments = async () => {
    if (!filmInfo) return
    const q = query(commentsRef, where('filmId', '==', filmInfo.id))
    const commentsSnapshot = await getDocs(q)
    const commentsData = commentsSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as any)
    )
    const filterComments = [...commentsData].sort(
      (a, b) => Date.parse(a) - Date.parse(b)
    )
    setComments(filterComments)
  }

  useEffect(() => {
    fetchDBVoteFilms()
  }, [auth.currentUser?.uid, filmInfo?.id, setVotes])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchDBSavedFilms()
        fetchDBVoteFilms()
      }
    })
    setDataLoaded(false)
    getComments()
    return unsubscribe
  }, [filmInfo])

  useEffect(() => {
    const savedFilm = savedFilms.find((film) => film.id === filmInfo?.id)
    if (savedFilm) {
      setMovieSave(true)
    } else {
      setMovieSave(false)
    }
  }, [savedFilms, filmInfo, movieSave])

  const handleFilmClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    setMovieSave((prev) => !prev)
    e.preventDefault()

    const userId = auth.currentUser?.uid

    if (!userId) {
      navigate('/profile')
      return
    }

    const savedFilm = savedFilms.find((film) => film.id === filmInfo?.id)

    if (!movieSave) {
      try {
        await addDoc(savedFilmsRef, {
          id: filmInfo?.id,
          image: filmInfo?.image,
          title: filmInfo?.title,
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
          console.log(filmDoc)
          await deleteDoc(filmDoc)
          await fetchDBSavedFilms()
        } catch (error) {
          console.error('Error del:', error)
        }
      }
    }
  }

  const updateVotesInDB = async () => {
    const docRef = votes.idDoc ? doc(db, 'voteFilms', votes.idDoc) : null
    const payload = {
      id: filmInfo?.id,
      image: filmInfo?.image,
      title: filmInfo?.title,
      vote: votes.vote,
      userId: auth?.currentUser?.uid,
    }
    if (docRef) {
      try {
        await updateDoc(docRef, { vote: votes.vote })
      } catch (error) {
        console.error('Error upd:', error)
      }
    } else {
      const existingVoteQuery = query(
        voteFilmsRef,
        where('id', '==', filmInfo?.id),
        where('userId', '==', auth?.currentUser?.uid)
      )
      const existingVoteDocs = await getDocs(existingVoteQuery)
      if (existingVoteDocs.size > 0) {
        const existingVoteDoc = existingVoteDocs.docs[0]
        const voteDocRef = doc(db, 'voteFilms', existingVoteDoc.id)
        try {
          await updateDoc(voteDocRef, { vote: votes.vote })
          setVotes({ ...votes, idDoc: existingVoteDoc.id })
        } catch (error) {
          console.error('Error updt: ', error)
        }
      } else {
        try {
          const newVoteDocRef = await addDoc(voteFilmsRef, payload)
          setVotes({ ...votes, idDoc: newVoteDocRef.id })
        } catch (error) {
          console.error('Error add: ', error)
        }
      }
    }
    fetchDBVoteFilms()
  }

  const handleVoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVotes({ ...votes, vote: e.target.value })
  }

  const handleBlur = async () => {
    setIsEditing(false)
    await updateVotesInDB()
  }

  const handleVoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsEditing(false)
    await updateVotesInDB()
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleComment = () => {
    if (!auth.currentUser) {
      navigate('/profile')
      return
    }
    setCommentOpen((prev) => !prev)
  }

  const handleSaveComment = async () => {
    const trimmedComment = commentDraft.trim()
    if (!filmInfo || trimmedComment === '') return
    await addDoc(commentsRef, {
      filmId: filmInfo.id,
      text: trimmedComment,
      userId: auth.currentUser?.uid,
      nickname: auth.currentUser?.displayName,
      time: new Date().toLocaleString(),
    })
    setCommentDraft('')
    setCommentOpen(false)
    getComments()
  }

  const handleDelete = async (commentId: string) => {
    if (!commentId) return
    await deleteDoc(doc(commentsRef, commentId))
    getComments()
  }

  return (
    <div className={styles.page}>
      {dataLoaded && (
        <div className={styles.loader}>
          <div className={styles.loaderimg} />
        </div>
      )}

      {!dataLoaded && (
        <>
          <div className={styles.imgAndInfo}>
            <div className={styles.img}>
              {filmInfo && filmInfo.image && (
                <img
                  src={filmInfo.image}
                  className={styles.imgSet}
                  alt="poster"
                />
              )}
            </div>

            <div className={styles.info}>
              <div className={styles.name}>
                {filmInfo ? filmInfo.fullTitle : ''}
              </div>
              <div className={styles.boxUser}>
                <div className={styles.func}>
                  <div>Сохранить</div>
                  <div
                    className={`${styles.save} ${
                      movieSave ? styles.unsave : styles.save
                    }`}
                    onClick={handleFilmClick}
                  ></div>
                </div>
                <div className={styles.func}>
                  <div>Оценить</div>
                  <div
                    className={
                      isEditing
                        ? styles.movieUserRatingEdit
                        : styles.movieUserRating
                    }
                    onClick={handleEditClick}
                  >
                    {isEditing ? (
                      <form onSubmit={handleVoteSubmit}>
                        <input
                          type="number"
                          value={votes.vote}
                          onChange={handleVoteChange}
                          onBlur={handleBlur}
                          min={1}
                          max={10}
                          step={0.5}
                          autoFocus
                          className={styles.inputstyles}
                        />
                      </form>
                    ) : (
                      votes.vote
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.header}>О фильме</div>
              <div className={styles.infoLine}>
                <div className={styles.nameInfo}>Жанр</div>
                <div className={styles.valInfo}>{filmInfo?.genres || '-'}</div>
              </div>
              <div className={styles.infoLine}>
                <div className={styles.nameInfo}>Год</div>
                <div className={styles.valInfo}>{filmInfo?.year || '-'}</div>
              </div>
              <div className={styles.infoLine}>
                <div className={styles.nameInfo}>Страна</div>
                <div className={styles.valInfo}>
                  {filmInfo?.countries || '-'}
                </div>
              </div>
              <div className={styles.infoLine}>
                <div className={styles.nameInfo}>Режисcер</div>
                <div className={styles.valInfo}>
                  {filmInfo?.directors || '-'}
                </div>
              </div>
              <div className={styles.infoLine}>
                <div className={styles.nameInfo}>Кинокомпании</div>
                <div className={styles.valInfo}>
                  {filmInfo?.companies || '-'}
                </div>
              </div>
              <div className={styles.infoLine}>
                <div className={styles.nameInfo}>IMDB</div>
                <div className={styles.valInfo}>
                  {filmInfo?.imDbRating || '-'}
                </div>
              </div>
              <div className={styles.infoLine}>
                <div className={styles.nameInfo}>Matacritic</div>
                <div className={styles.valInfo}>
                  {filmInfo?.metacriticRating || '-'}
                </div>
              </div>
              <div className={styles.infoLine}>
                <div className={styles.nameInfo}>В главных ролях</div>
                <div className={styles.valInfo}>{filmInfo?.stars || '-'}</div>
              </div>
              <div className={styles.infoLine}>
                <div className={styles.nameInfo}>Дата выхода</div>
                <div className={styles.valInfo}>
                  {filmInfo?.releaseDate || '-'}
                </div>
              </div>
              <div className={styles.infoLine}>
                <div className={styles.nameInfo}>Время</div>
                <div className={styles.valInfo}>
                  {filmInfo?.runtimeMins !== null
                    ? filmInfo?.runtimeMins + ' м'
                    : '-'}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.comment}>
            <div className={styles.headerComment}>Комментарии</div>
            <div className={styles.tableComments}>
              {comments &&
                comments.map((item: any, index: number) => (
                  <div key={index}>
                    <Comment
                      text={item.text}
                      user={item.nickname}
                      time={item?.time}
                      userId={item.userId}
                      onDelete={() => handleDelete(item.id)}
                    />
                  </div>
                ))}
            </div>

            <div className={styles.bodyComment}>
              <div className={styles.buttonsGaps}>
                <div className={styles.buttonWrite} onClick={handleComment}>
                  Написать комментарий
                </div>
                {commentOpen && (
                  <div
                    className={styles.buttonWrite}
                    onClick={handleSaveComment}
                  >
                    Сохранить
                  </div>
                )}
              </div>

              {commentOpen && (
                <textarea
                  className={styles.textCommentBox}
                  maxLength={200}
                  value={commentDraft}
                  onChange={(e) => setCommentDraft(e.target.value)}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default FilmDescription
