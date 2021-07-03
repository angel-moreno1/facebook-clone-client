import { useState } from 'react';
import styles from './CreatePostToFriend.module.css'
import translate from '../../i18n/translate'
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';

const CreatePostToFriend = () => {

    const user = useSelector(selectUser)
    const [text, setText] = useState()

    return (
        <form encType='multipart/form-data' className={styles.card} onSubmit={event => event.preventDefault()}>
            <div className={styles.input_img}>
                <div className={styles.profile}>
                    <img src={user.profile_photo} style={{ width: '2rem', height: '2rem', borderRadius: '50%', marginRight: '5px' }} alt='profile_photo' />
                </div>
                <input name='text' placeholder='write something to your friend' autoComplete={'off'} value={text} onChange={({ target }) => setText(target.value)} />
            </div>
            <div className={styles.files}>
                <input type='file' name='file' id='phvi' />
                <label htmlFor='phvi' className={styles.photo_video}>
                    <svg xmlns="http://www.w3.org/2000/svg" color='rgb(50, 233, 111)' width='2rem' viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <h5>{translate('photo-video')}</h5>
                </label >
                <div className={styles.fellings}  >
                    <svg xmlns="http://www.w3.org/2000/svg" width='2rem' color='rgb(229, 241, 60)' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h5>{translate('fellings')}</h5>
                    <div className={styles.popup} style={{ display: 'none', marginButton: '2rem' }}>
                        <ul>
                            <li>bad</li>
                            <li>happy</li>
                            <li>love</li>
                            <li>angry</li>
                        </ul>
                    </div>
                </div>
                <button className={styles.submit}>publish</button>
            </div>

        </form>
    )
}


export default CreatePostToFriend