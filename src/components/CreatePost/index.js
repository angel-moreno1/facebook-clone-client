import { useState, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cratePost } from '../../features/postSlice'
import { selectUser } from '../../features/userSlice'
import socketContext from '../useSocketContext'
import styles from './CreatePost.module.css'
import translate from '../../i18n/translate'
import { useIntl } from 'react-intl'

const CreatePost = () => {

    const { socket } = useContext(socketContext)
    const [ file, setFile ] = useState('')
    const [ text, setText ] = useState('')
    const [ felling, setFelling ] = useState('')
    const dispatch = useDispatch()
    const user =  useSelector(selectUser)
    const intl = useIntl()
    const [ showFellingPick, setFellingPick ] = useState(false)
    const [ activeFellingPick, setActiveFellingPick ] = useState(false)

    const handleSubmit = event => {
        event.preventDefault()
        const data = new FormData()
        if(felling) {
            data.append('felling', felling)
        }
        if(text && file) {
            data.append('file', file)
            data.append('text', text)
        }else if (text){
            data.append('text', text)
        }else {
            data.append('file', file)
        }
        dispatch(cratePost({ postData: data, socket, token: user.token }))
        setFile('')
        setText('')  
    }

    const onHoverFelling = () => setActiveFellingPick(true)
    const onLeaveFelling = () => setActiveFellingPick(false)

    useEffect(() => {
        let timeOutFelling
        if(activeFellingPick === true) {
            timeOutFelling = setTimeout(() => {
                setFellingPick(true)
            }, 200)
        }else {
            timeOutFelling = setTimeout(() => {
                setFellingPick(false)
            }, 100)
        }
        
        return () => clearTimeout(timeOutFelling)
    }, [activeFellingPick])

    return (
        <form encType='multipart/form-data' className={styles.card} style={ file || text ? { borderRadius: '1rem 1rem 0 0 ' } : null} onSubmit={handleSubmit}>
            <div  className={styles.input_img}>
                <div className={styles.profile}>
                    <img src={user.profile_photo} style={{ width: '2rem', height: '2rem' , borderRadius: '50%', marginRight: '5px' }}  alt='profile_photo' />
                </div>
                <input name='text' autoComplete={'off'}  value={text}  placeholder={intl.formatMessage({ id: 'create-post-input' }) + user.name.trim() + '?'} onChange={ ({target}) => setText(target.value)} />
            </div>
            <div className={styles.files}> 
                <input type='file' name='file' id='phvi' onChange={({ target }) => setFile(target.files[0])} />
                <label htmlFor='phvi' className={styles.photo_video}>
                    <svg xmlns="http://www.w3.org/2000/svg" color='rgb(50, 233, 111)' width='2rem' viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg> 
                    <h5>{ translate('photo-video') }</h5>
                </label >
                <div className={styles.fellings} onMouseOver={onHoverFelling} onMouseLeave={onLeaveFelling} >
                        <svg xmlns="http://www.w3.org/2000/svg" width='2rem' color='rgb(229, 241, 60)'  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg> 
                        <h5>{ translate('fellings') }</h5>
                        <div className={styles.popup} style={showFellingPick ? { display: 'block' } : { display: 'none' }}>
                            <ul>
                                <li onClick={() => setFelling('bad')} >bad</li>
                                <li onClick={() => setFelling('happy')} >happy</li>
                                <li onClick={() => setFelling('love')} >love</li>
                                <li onClick={() => setFelling('angry')} >angry</li>
                            </ul>
                        </div>
                </div>
            </div>
            {
                file || text
                    ? <button className={styles.submit}>publish</button>
                    : null
            }
    </form>
    )
}


export default  CreatePost