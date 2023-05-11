import React, { useState } from 'react'
import Comment from '../Comment/Comment'

import styles from './FilmDescription.module.css'

const USER: string = 'TIM'

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

interface Props {
  filmInfo: FilmInfo | null
}

const FilmDescription: React.FC<Props> = ({ filmInfo }) => {
  const [save, setSave] = useState<boolean>(false)
  const [vote, setVote] = useState<number | null>(null)

  const [comments, setComments] = useState<string[]>([])
  const [commentOpen, setCommentOpen] = useState<boolean>(false)

  const [commentDraft, setCommentDraft] = useState<string>('')

  const handleComment = () => {
    setCommentOpen((prev) => !prev)
  }

  const handleSave = () => {
    setSave((prev) => !prev)
  }

  const handleSaveComment = () => {
    const trimmedComment = commentDraft.trim()
    if (trimmedComment !== '') {
      setComments((prevComments: string[]) => [...prevComments, trimmedComment])
      setCommentDraft('')
      setCommentOpen(false)
    }
  }

  const handleDelete = (index: number) => {
    setComments((prevComments: string[]) => {
      const newComments = [...prevComments]
      newComments.splice(index, 1)
      return newComments
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.imgAndInfo}>
        <div className={styles.img}>
          {filmInfo && filmInfo.image && (
            <img src={filmInfo.image} className={styles.imgSet} />
          )}
        </div>

        <div className={styles.info}>
          <div className={styles.name}>
            {filmInfo ? filmInfo.fullTitle : ''}
          </div>
          <div className={styles.boxUser}>
            <div className={styles.func}>
              <div>Сохранить</div>
              <div
                className={`${styles.save} ${
                  save ? styles.unsave : styles.save
                }`}
                onClick={handleSave}
              ></div>
            </div>
            <div className={styles.func}>
              <div>Оценить</div>
              <div className={styles.vote}></div>
            </div>
          </div>
          <div className={styles.header}>О фильме</div>
          <div className={styles.infoLine}>
            <div className={styles.nameInfo}>Жанр</div>
            <div className={styles.valInfo}>{filmInfo?.genres || '-'}</div>
          </div>
          <div className={styles.infoLine}>
            <div className={styles.nameInfo}>Год</div>
            <div className={styles.valInfo}>{filmInfo?.year || '-'}</div>
          </div>
          <div className={styles.infoLine}>
            <div className={styles.nameInfo}>Страна</div>
            <div className={styles.valInfo}>{filmInfo?.countries || '-'}</div>
          </div>
          <div className={styles.infoLine}>
            <div className={styles.nameInfo}>Режисcер</div>
            <div className={styles.valInfo}>{filmInfo?.directors || '-'}</div>
          </div>
          <div className={styles.infoLine}>
            <div className={styles.nameInfo}>Кинокомпании</div>
            <div className={styles.valInfo}>{filmInfo?.companies || '-'}</div>
          </div>
          <div className={styles.infoLine}>
            <div className={styles.nameInfo}>IMDB</div>
            <div className={styles.valInfo}>{filmInfo?.imDbRating || '-'}</div>
          </div>
          <div className={styles.infoLine}>
            <div className={styles.nameInfo}>Matacritic</div>
            <div className={styles.valInfo}>
              {filmInfo?.metacriticRating || '-'}
            </div>
          </div>
          <div className={styles.infoLine}>
            <div className={styles.nameInfo}>В главных ролях</div>
            <div className={styles.valInfo}>{filmInfo?.stars || '-'}</div>
          </div>
          <div className={styles.infoLine}>
            <div className={styles.nameInfo}>Дата выхода</div>
            <div className={styles.valInfo}>{filmInfo?.releaseDate || '-'}</div>
          </div>
          <div className={styles.infoLine}>
            <div className={styles.nameInfo}>Время</div>
            <div className={styles.valInfo}>
              {filmInfo?.runtimeMins !== null
                ? filmInfo?.runtimeMins + 'м'
                : '-'}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.comment}>
        <div className={styles.headerComment}>Комментарии</div>
        <div className={styles.tableComments}>
          {comments &&
            comments.map((item: any, index: number) => (
              <div key={index}>
                <Comment
                  text={item}
                  user={USER}
                  onDelete={() => handleDelete(index)}
                />
              </div>
            ))}
        </div>

        <div className={styles.bodyComment}>
          <div className="flex gap-10">
            <div className={styles.buttonWrite} onClick={handleComment}>
              {' '}
              Написать комментарий{' '}
            </div>
            {commentOpen && (
              <div className={styles.buttonWrite} onClick={handleSaveComment}>
                {' '}
                Сохранить{' '}
              </div>
            )}
          </div>

          {commentOpen && (
            <textarea
              className={styles.textCommentBox}
              maxLength={200}
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default FilmDescription
