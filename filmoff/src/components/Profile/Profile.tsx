import React, { useEffect, useState } from 'react'
import styles from './Profile.module.css'
import { useParams, useNavigate } from 'react-router-dom'
import { auth, db } from '../../config/firebase'
import SavedFilmTable from '../SavedFilmTable/SavedFilmTable'

import {
  collection,
  doc,
  query,
  where,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore'

interface ProfileProps {
  handleLogout: () => void
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

type User = {
  displayName: string | null
  email: string | null
  id?: string
  idUser?: string
  nickname: string
  isShowFilms: boolean
}

const Profile: React.FC<ProfileProps> = ({ handleLogout }) => {
  const savedFilmsRef = collection(db, 'savedFilms')
  const voteFilmsRef = collection(db, 'voteFilms')
  const commentsRef = collection(db, 'comments')
  const usersRef = collection(db, 'users')

  const navigate = useNavigate()
  const [savedFilms, setSavedFilms] = useState<SavedFilm[]>([])
  const [comments, setComments] = useState<string[]>([])
  const [votes, setVotes] = useState<VoteFilm[]>([])

  const [isYourProfile, setIsYourProfile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])

  const [diffUser, setDiffUser] = useState<string>('')
  const [displayName, setDisplayName] = useState<string>('')
  const [isShowFilms, setIsShowFilms] = useState(false)

  const { id } = useParams<{ id?: string }>()

  const fetchUsers = async () => {
    try {
      const unsubscribe = onSnapshot(usersRef, (snapshot) => {
        const users = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as User)
        )
        setUsers(users)
      })

      return unsubscribe
    } catch (error) {
      console.error('Error fetch users:', error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userBD) => {
      if (!userBD) {
        if (id && users.some((user) => user.idUser === id)) {
          //ne reg но есть в списке - остаемся у другого юзера
          setIsYourProfile(false)
          setDiffUser(id)
        } else {
          //ne reg и в списке нет - переходим на /profile
          if (users.length > 0) {
            navigate('/profile')
          }
        }
      } else {
        if (id && users.some((user) => user.idUser === id)) {
          //reg и есть в списке - остаемся у другого юзера
          if (users.length > 0) {
            setIsYourProfile(userBD.uid === id)
          }

          if (userBD.uid !== id) {
            setDiffUser(id)
          }
        } else {
          //reg и нету в списке юзера - переходим к себе
          setIsYourProfile(true)
          setDiffUser('')
          if (users.length > 0 && isYourProfile) {
            navigate(`/profile/${userBD.uid}`)
          }
        }
      }
    })
    return unsubscribe
  }, [id, navigate, users])

  useEffect(() => {
    if (!isYourProfile && !diffUser) return

    const userId = isYourProfile ? auth.currentUser?.uid : diffUser

    const user = users.find((user) => user.idUser === userId)

    const displayName = user?.nickname

    setDisplayName(displayName as string)
    setIsShowFilms(user?.isShowFilms as boolean)

    const savedFilmsQuery = query(savedFilmsRef, where('userId', '==', userId))
    const savedFilmsUnsubscribe = onSnapshot(savedFilmsQuery, (snapshot) => {
      const data = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as SavedFilm)
      )
      setSavedFilms(data)
      setIsLoading(false)
    })

    const commentsQuery = query(commentsRef, where('userId', '==', userId))
    const commentsUnsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const data = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as any)
      )
      setComments(data)
      setIsLoading(false)
    })

    const votesQuery = query(voteFilmsRef, where('userId', '==', userId))
    const votesUnsubscribe = onSnapshot(votesQuery, (snapshot) => {
      const data = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as VoteFilm)
      )
      setVotes(data)
      setIsLoading(false)
    })

    return () => {
      savedFilmsUnsubscribe()
      commentsUnsubscribe()
      votesUnsubscribe()
      setIsLoading(true)
    }
  }, [isYourProfile, diffUser, users, isShowFilms])

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const userId = isYourProfile ? auth.currentUser?.uid : null
    if (!userId) return

    const ref = users.find((user) => user.idUser === userId)?.id as string

    const updateUserInCollection = async (
      userId: string,
      showFilms: boolean
    ) => {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, { isShowFilms: showFilms })
    }

    try {
      setIsLoading(true)
      await updateUserInCollection(ref, event.target.checked)
      setIsShowFilms(event.target.checked)
    } catch (error) {
      console.error('Error upd user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {(isYourProfile || diffUser) && users.length > 0 && (
        <div className={styles.main}>
          {isLoading ? (
            <div className={styles.loader}>
              <div className={styles.loaderimg} />
            </div>
          ) : (
            <>
              <div className={styles.header}>Профиль</div>
              <div className={styles.profile}>
                <div className={styles.header}>{displayName}</div>
                <div className={styles.infoBox}>
                  {diffUser ? null : (
                    <div className={styles.infoLine}>
                      <div className={styles.nameInfo}>Логин</div>
                      <div>{auth.currentUser?.email}</div>
                    </div>
                  )}
                  <div className={styles.infoLine}>
                    <div className={styles.infoCheck}>
                      <div className={styles.nameInfo}>Сохраненные</div>
                      {diffUser ? null : (
                        <div className={styles.checkboxContainer}>
                          <input
                            type="checkbox"
                            checked={isShowFilms}
                            onChange={handleCheckboxChange}
                            className={styles.checkbox}
                          />
                        </div>
                      )}
                    </div>

                    <div>{isLoading ? '' : savedFilms.length}</div>
                  </div>
                  <div className={styles.infoLine}>
                    <div className={styles.nameInfo}>Оценки</div>
                    <div>{isLoading ? '' : votes.length}</div>
                  </div>
                  <div className={styles.infoLine}>
                    <div className={styles.nameInfo}>Комментарии</div>
                    <div>{isLoading ? '' : comments.length}</div>
                  </div>
                </div>

                {diffUser ? null : (
                  <div className={styles.buttonDiv}>
                    <button className={styles.button} onClick={handleLogout}>
                      Выйти
                    </button>
                  </div>
                )}
              </div>
              {savedFilms.length > 0 && (
                <>
                  {!isYourProfile && diffUser && isShowFilms && (
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
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Profile
