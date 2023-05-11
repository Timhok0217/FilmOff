import React from 'react'
import styles from './App.module.css'
import Navbar from './components/Navbar/Navbar'
import { Route, Router, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import MyPage from './pages/MyPage'
import ProfilePage from './pages/ProfilePage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'
import CardFilmPage from './pages/CardFilmPage'
import Grid from './components/Grid/Grid'
import Footer from './components/Footer/Footer'
import { useState } from 'react'
import Profile from './components/Profile/Profile'
import { useNavigate } from 'react-router-dom'

interface User {
  id: number,
  login: string,
  password: string,
  nickname: string,
  savedFilms: number,
  savedFilmsList: Film[],
  vote: number,
  voteList: Vote[],
  comments: number
}

interface Film {
  id: string,
  image: string
}

interface Vote {
  id: string,
  image: string,
  vote: number
}

const USER: User  = {
  id: 1,
  login: 'tim@mail.ru',
  password: 'test',
  nickname: 'Tima',
  savedFilms: 2,
  savedFilmsList: [
    {
      id: 'tt0903747',
      image:
        'https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_Ratio0.6837_AL_.jpg',
    },
    {
      id: 'tt12708542',
      image:
        'https://m.media-amazon.com/images/M/MV5BNDA5YzQzYmItZTE4NC00NTNkLTljZGItNDQ0YjI3MzdhZjlhXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_Ratio0.6837_AL_.jpg',
    },
  ],
  vote: 3,
  voteList: [
    {
      id: 'tt0903747',
      image:
        'https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_Ratio0.6837_AL_.jpg',
      vote: 7.5,
    },
    {
      id: 'tt12708542',
      image:
        'https://m.media-amazon.com/images/M/MV5BNDA5YzQzYmItZTE4NC00NTNkLTljZGItNDQ0YjI3MzdhZjlhXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_Ratio0.6837_AL_.jpg',
      vote: 6.5,
    },
    {
      id: 'tt15469618',
      image:
        'https://m.media-amazon.com/images/M/MV5BNjc2ZWY3NjYtM2Q5OS00YTI1LTk5MDktYjYwYTk2Yzc4YTc4XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_Ratio0.6837_AL_.jpg',
      vote: 5,
    },
  ],
  comments: 20,
}

function App() {
  const [film, setFilm] = useState('')

  const navigate = useNavigate()

  const [loggedIn, setLoggedIn] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('login')
    setLoggedIn(false)
    navigate('/profile')
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
      <div className="h-20"></div>
      <Routes>
        <Route path="/" element={<HomePage film={film} />} />
        <Route path="/myPage" element={<MyPage user={USER} />} />
        <Route
          path="/profile"
          element={
            <ProfilePage
              user={USER}
              loggedIn={loggedIn}
              handleLogout={handleLogout}
              onLoginStatusChange={handleLoginStatusChange}
            />
          }
        />
        <Route
          path="profile/:id"
          element={<Profile user={USER} handleLogout={handleLogout} />}
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/cardFilm/:id" element={<CardFilmPage />} />
      </Routes>
      {/* <Grid/> */}
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  )
}

export default App
