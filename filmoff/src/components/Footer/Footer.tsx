import React from 'react'
import styles from './Footer.module.css'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className={styles.footerLg}>
      <ul className={styles.list_footerLg}>
        <li>
          <span>
            <Link to={'/about'}>
              <button className={styles.button}>About</button>
            </Link>
          </span>
          <span>
            <p className="text-sm">© {new Date().getFullYear()} FilmOff</p>
          </span>
        </li>
        <li>
          <p className="text-xs">
            This content create with materials from IMDB-API.
          </p>
        </li>
      </ul>
    </footer>
  )
}

export default Footer
