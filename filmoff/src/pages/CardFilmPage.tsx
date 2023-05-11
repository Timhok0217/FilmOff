import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FilmDescription from '../components/FilmDescription/FilmDescription'

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

const CardFilmPage = () => {
  const [filmInfo, setFilmInfo] = useState<FilmInfo | null>(null)

  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    const savedFilmInfo = localStorage.getItem('filmInfo')
    if (savedFilmInfo) {
      setFilmInfo(JSON.parse(savedFilmInfo))
    }
  }, [])

  useEffect(() => {
    const fetchMovieInfo = async () => {
      try {
        if (id) {
          const savedFilmInfo = localStorage.getItem('filmInfo')
          if (savedFilmInfo) {
            const savedFilmData = JSON.parse(savedFilmInfo)
            if (savedFilmData.id == id) {
              setFilmInfo(savedFilmData)
              return
            }
          }
          console.log('zapros')
          const response = await axios.get(
            `https://imdb-api.com/en/API/Title/k_43to2og1/${id}` 
          )
          const { data } = response
          setFilmInfo(data)
          localStorage.setItem('filmInfo', JSON.stringify(data))
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchMovieInfo()
  }, [id])

  return (
    <>
      <FilmDescription filmInfo={filmInfo} />
    </>
  )
}

export default CardFilmPage
