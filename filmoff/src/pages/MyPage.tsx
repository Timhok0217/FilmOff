import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import MyContent from '../components/MyContent/MyContent'

interface User {
  id: number
  login: string
  password: string
  nickname: string
  savedFilms: number
  savedFilmsList: Film[]
  vote: number
  voteList: Vote[]
  comments: number
}

interface Film {
  id: string
  image: string
}

interface Vote {
  id: string
  image: string
  vote: number
}
interface Props {
  user: User
}

const MyPage: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate()

  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('login')) {
      setShowContent(false)
      navigate('/profile')
    } else {
      setShowContent(true)
    }
  }, [])

  return <>{showContent && <MyContent user={user} />}</>
}

export default MyPage
