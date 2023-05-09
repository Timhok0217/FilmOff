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


function App() {
  const [film, setFilm] = useState('')

  const handleFilmChange = (newFilm: string) => {
    setFilm(newFilm)

  }

  return (
    <div className={styles.App}>
      <Navbar film={film} onFilmChange={handleFilmChange} />
      <h1 className="h-20">Logo</h1>
      <Routes>
        <Route path="/" element={<HomePage film={film} />} />
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/profile" element={<ProfilePage />} />
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
