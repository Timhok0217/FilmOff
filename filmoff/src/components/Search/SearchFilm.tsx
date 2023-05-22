import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './SearchFilm.module.css'

const SearchFilm: React.FC<any> = ({ onFilmChange, onBlur }) => {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showRecentSearches, setShowRecentSearches] = useState(false)
  const navigate = useNavigate()
  const inputRef = React.createRef<HTMLInputElement>()
  const location = useLocation()
  const currentPath = location.pathname

  useEffect(() => {
    const allSearchResults = JSON.parse(
      localStorage.getItem('allSearchResults') || '[]'
    )
    setSearchResults(allSearchResults)
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanedQuery = query.trim().toLowerCase()

    //Удаление спец символов
    const sanitizedQuery = cleanedQuery.replace(
      /[^a-zA-Z0-9а-яА-ЯёЁ\s!?.]/g,
      ''
    )

    const formattedQuery = sanitizedQuery.replace(/\s{2,}/g, ' ') //Замена двойных пробелов на одинарные

    if (formattedQuery) {
      try {
        const searchResults = await onFilmChange(
          cleanedQuery.replace(/\s{2,}/g, ' ')
        )

        if (currentPath !== '/') {
          onBlur()
        }

        navigate('/')

        const allSearchResults = JSON.parse(
          localStorage.getItem('allSearchResults') || '[]'
        )
        const existingSearch = allSearchResults.find(
          (search: any) => search.title === cleanedQuery.replace(/\s{2,}/g, ' ')
        )

        if (!existingSearch) {
          if (allSearchResults.length >= 12) {
            allSearchResults.shift() // удаляем первый элемент
          }
          allSearchResults.push({
            title: cleanedQuery.replace(/\s{2,}/g, ' '),
            results: searchResults.data,
          }) // добавляем новый элемент в конец
          localStorage.setItem(
            'allSearchResults',
            JSON.stringify(allSearchResults)
          )
        }

        setSearchResults(allSearchResults)
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleBlur = () => {
    onBlur()
    setShowRecentSearches(false)
  }

  const handleReset = (event: React.MouseEvent<HTMLButtonElement>) => {
    setQuery('')
  }

  const handleRecentSearchClick = (recentSearch: any, event: any) => {
    event.preventDefault()
    setQuery(recentSearch.title)
    onFilmChange(recentSearch.title)
    navigate('/')
    handleBlur()
  }

  const handleSearchResultClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const filteredSearchResults =
    searchResults &&
    searchResults.filter((item: any) => item.results && item.results.length > 0)
  const recentSearches =
    filteredSearchResults && filteredSearchResults.slice(-12)

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Поиск фильмов и сериалов"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={styles.input}
          autoFocus
          onBlur={handleBlur}
          ref={inputRef}
          onFocus={() => setShowRecentSearches(true)}
        />
        <button type="reset" className={styles.button} onClick={handleReset}>
          <div className={styles.close}></div>
        </button>
      </form>
      {showRecentSearches && recentSearches.length > 0 && (
        <div className={styles.recentSearches}>
          <div className={styles.boxSearchHistory}>
            <div className={styles.headerHistory}>Предыдущий поиск:</div>
            <div className={styles.lineSearches}>
              {recentSearches &&
                recentSearches.reverse().map((recentSearch: any) => (
                  <div
                    key={recentSearch.title}
                    className={styles.recentSearch}
                    onClick={(event) =>
                      handleRecentSearchClick(recentSearch, event)
                    }
                    onMouseDown={handleSearchResultClick}
                  >
                    {recentSearch.title}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchFilm
