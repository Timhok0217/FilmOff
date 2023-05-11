import React, { useEffect, useState } from 'react'
import styles from './Profile.module.css'
import { useParams, useNavigate } from 'react-router-dom';

interface User {
    id: number
    login: string
    password: string
    nickname: string
    savedFilms: number
    savedFilmsList: Film[]
    vote: number
    voteList: Vote[]
    comments: number
  }
  
  interface Film {
    id: string
    image: string
  }
  
  interface Vote {
    id: string
    image: string
    vote: number
  }

  interface ProfileProps {
    user: User
    handleLogout: () => void
}

const Profile: React.FC<ProfileProps> = ({ user, handleLogout }) => {

    const [isYourProfile, setIsYourProfile] = useState(false);
    const navigate = useNavigate();

    const { id } = useParams<{ id?: string }>();

    useEffect(() => {
        console.log(id, user.id)
        if (!localStorage.getItem('login')) {
            navigate('/profile');
        } else if (user.id == Number(id)) {
            setIsYourProfile(true);
        } else {
            setIsYourProfile(false);
            navigate(`/profile/${user.id}`);
        }
      }, [user.id, id]);



  return (
    <div className={styles.page}>
        {isYourProfile && 
            <div className={styles.main}>
                <div className={styles.header}>Профиль</div>
                <div className={styles.profile}>
                    <div className={styles.header}>
                        {user.nickname}
                    </div>
                    <div className={styles.infoBox}>
                        <div className={styles.infoLine}>
                            <div className={styles.nameInfo}>Логин</div>
                            <div >{user.login}</div>
                        </div>
                        <div className={styles.infoLine}>
                            <div className={styles.nameInfo}>Сохраненные</div>
                            <div >{user.savedFilms}</div>
                        </div>
                        <div className={styles.infoLine}>
                            <div className={styles.nameInfo}>Оценки</div>
                            <div >{user.vote}</div>
                        </div>
                        <div className={styles.infoLine}>
                            <div className={styles.nameInfo}>Комментарии</div>
                            <div >{user.comments}</div>
                        </div>
                    </div>

                    <div className='flex justify-center items-center'>
                        <button className={styles.button} onClick={handleLogout}>Выйти</button>
                    </div>
                </div>
            </div>
        }
    </div>
    
    
    )
}

export default Profile