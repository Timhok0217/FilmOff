import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import MyContent from '../components/MyContent/MyContent'

import { auth } from '../config/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const MyPage = () => {
  const navigate = useNavigate()

  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setShowContent(true)
      } else {
        setShowContent(false)
        navigate('/profile')
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return <>{showContent && <MyContent />}</>
}

export default MyPage
