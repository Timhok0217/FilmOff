import React, { useState, useRef, useEffect } from 'react'
import { Link, useResolvedPath, useMatch } from 'react-router-dom'
import SearchFilm from '../Search/SearchFilm'

import styles from './Navbar.module.css'

interface NavbarProps {
  film: string
  onFilmChange: (film: string) => void
}

const Navbar: React.FC<NavbarProps> = ({ film, onFilmChange }) => {
  const [showSearch, setShowSearch] = useState(false)
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)

  const handleSearchClick = () => {
    setShowSearch(true)
  }

  const handleSearchBlur = () => {
    setShowSearch(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchRef])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset
      setIsNavVisible(currentScrollPos <= prevScrollPos)
      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [prevScrollPos])

  return (
    <header
      className={`${styles.header} ${isNavVisible ? '' : styles.headerHidden}`}
    >
      <Link to="/" className={styles.headerTitle}>
        FilmOff
      </Link>
      <ul className={styles.listHeader}>
        <li ref={searchRef as unknown as React.LegacyRef<HTMLLIElement>}>
          <div className={styles.searchContainer}>
            {showSearch ? (
              <SearchFilm
                onBlur={handleSearchBlur}
                film={film}
                onFilmChange={onFilmChange}
              />
            ) : (
              <div
                className={styles.search}
                onClick={handleSearchClick}
                tabIndex={0}
              ></div>
            )}
          </div>
        </li>
        {showSearch ? null : (
          <>
            <CustomLink to="/" className="HomePage">
              Главная
            </CustomLink>
            <CustomLink to="/myPage" className="MyPage">
              Мое
            </CustomLink>
            <CustomLink to="/profile" className="ProfilePage">
              <div className={styles.profileIcon}> </div>
            </CustomLink>
          </>
        )}
      </ul>
    </header>
  )
}

interface CustomLinkProps {
  to: string
  children: React.ReactNode
  className?: string
}

function CustomLink({
  to,
  children,
  className = '',
  ...props
}: CustomLinkProps) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? `${styles.active} ${className}` : className}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}

export default Navbar
