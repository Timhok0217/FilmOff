import React, { useEffect } from 'react'
import styles from './App.module.css'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import MyPage from './pages/MyPage'
import ProfilePage from './pages/ProfilePage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'
import CardFilmPage from './pages/CardFilmPage'
import InRatingPage from './pages/InRatingPage'

import Footer from './components/Footer/Footer'
import { useState } from 'react'
import Profile from './components/Profile/Profile'
import { useNavigate } from 'react-router-dom'

import { auth } from './config/firebase'

function App() {
  const [film, setFilm] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true)
      } else {
        setLoggedIn(false)
      }
    })
  }, [])

  const handleLogout = async () => {
    try {
      await auth.signOut()
      setLoggedIn(false)
      navigate('/profile')
    } catch (error) {
      console.log(error)
    }
  }

  const handleFilmChange = (newFilm: string) => {
    setFilm(newFilm)
  }

  const handleLoginStatusChange = (isLoggedIn: boolean) => {
    setLoggedIn(isLoggedIn)
  }

  return (
    <div className={styles.App}>
      <Navbar film={film} onFilmChange={handleFilmChange} />
      <div className={styles.h}></div>
      <Routes>
        <Route path="/" element={<HomePage film={film} />} />
        <Route path="/myPage" element={<MyPage />} />
        <Route
          path="/profile"
          element={
            <ProfilePage
              loggedIn={loggedIn}
              handleLogout={handleLogout}
              onLoginStatusChange={handleLoginStatusChange}
            />
          }
        />
        <Route
          path="profile/:id"
          element={<Profile handleLogout={handleLogout} />}
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/cardFilm/:id" element={<CardFilmPage />} />
        <Route path="/inRating" element={<InRatingPage />} />
      </Routes>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  )
}

export default App
