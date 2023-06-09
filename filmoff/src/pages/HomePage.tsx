import { useEffect, useState } from 'react'
import React from 'react'
import axios from 'axios'
import CardTable from '../components/CardTable/CardTable'
import styles from './styles/HomePage.module.css'

interface Props {
  film: string
}

const HomePage: React.FC<Props> = ({ film }) => {
  const [popularFilms, setPopularFilms] = useState([])
  const [searchResults, setSearchResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        setIsLoading(true)
        let savedFilms = localStorage.getItem('popularFilms')
        if (savedFilms) {
          savedFilms = JSON.parse(savedFilms)
          setPopularFilms(savedFilms as any)
        } else {
          const response = await axios.get(
            'https://imdb-api.com/en/API/MostPopularMovies/k_z3slxcrh'
          )
          const { data } = response
          setPopularFilms(data.items)
          localStorage.setItem('popularFilms', JSON.stringify(data.items))
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
        setIsPageLoading(false)
      }
    }

    fetchPopularMovies()
  }, [])

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setIsLoading(true) // начало загрузки данных
        setIsPageLoading(true)
        if (film) {
          let allSearchResults = JSON.parse(
            localStorage.getItem('allSearchResults') || '[]'
          )
          let cachedResults = allSearchResults.find(
            (item: { title: string }) => item.title === film
          )

          if (cachedResults) {
            setSearchResults(cachedResults.results)
            localStorage.setItem('lastSearch', film)
          } else {
            //2 запроса к api - из-за рейтинга
            const response = await axios.get(
              `https://imdb-api.com/API/AdvancedSearch/k_z3slxcrh?title=${film.replace(
                /[^a-zA-Z0-9а-яА-ЯёЁ\s!?.]/g,
                ''
              )}`
            )
            const { data } = response
            setSearchResults(data.results)

            allSearchResults.push({ title: film, results: data.results })

            // Ограничиваем количество сохраненных объектов в localStorage
            if (allSearchResults.length > 12) {
              allSearchResults.shift()
            }

            localStorage.setItem(
              'allSearchResults',
              JSON.stringify(allSearchResults)
            )
            localStorage.setItem('lastSearch', film)
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false) // окончание загрузки данных
        setIsPageLoading(false)
      }
    }

    fetchSearchResults()
  }, [film])

  useEffect(() => {
    setIsLoading(true)
    const lastSearch = localStorage.getItem('lastSearch')
    let allSearchResults = JSON.parse(
      localStorage.getItem('allSearchResults') || '[]'
    )
    const cachedResults = allSearchResults.find(
      (item: { title: string }) => item.title === lastSearch
    )
    if (cachedResults) {
      setSearchResults(cachedResults.results)
    } else {
      setSearchResults(popularFilms as any)
    }
    setIsLoading(false)
  }, [popularFilms])

  useEffect(() => {
    if (searchResults && film) {
      const allSearchResults = JSON.parse(
        localStorage.getItem('allSearchResults') || '[]'
      )
      const index = allSearchResults.findIndex(
        (item: { title: string }) => item.title === film
      )

      if (index !== -1) {
        //Если запрос уже существует - удаляем из массива
        allSearchResults.splice(index, 1)
      }
      allSearchResults.push({ title: film, results: searchResults })

      localStorage.setItem('allSearchResults', JSON.stringify(allSearchResults))
      localStorage.setItem('lastSearch', film)
    }
  }, [searchResults, film])

  const results = searchResults ? searchResults : popularFilms

  return (
    <>
      {isPageLoading ? (
        <div className={styles.loader}>
          <div className={styles.loaderimg} />
        </div>
      ) : (
        <>
          <div className={styles.header}>
            {localStorage.getItem('lastSearch')
              ? `Результаты поиска ${localStorage.getItem('lastSearch')}:`
              : 'Самые популярные фильмы:'}
          </div>
          {results.length > 0 ? (
            <CardTable popularFilms={results} isLoading={isLoading} />
          ) : null}
        </>
      )}
      {!isPageLoading &&
        results.length === 0 &&
        localStorage.getItem('lastSearch') && (
          <div className={styles.header}>
            Не удалось ничего найти! Повторите поиск
          </div>
        )}
    </>
  )
}

export default HomePage
