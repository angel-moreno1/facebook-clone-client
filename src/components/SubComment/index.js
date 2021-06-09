import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectUser } from '../../features/userSlice'
import translate from '../../i18n/translate'
import parserCommentTime from '../../utils/parserCommentTime'
import { useIntl } from "react-intl";
import styles from './subComment.module.css'
import Picker from 'emoji-picker-react';
import axios from 'axios'

const SubComment =  props => {

    const {user, text, respondTo, createdAt, likes,  commentId, handleAddSub } = props

    const [ reply, setReply ] = useState(false)
    const [ likesLocal, setLikesLocal ] = useState(likes.length)
    const [ clicked, setclicked ] = useState(false)
    const [ textLocal, setTextLocal ] = useState('')
    const { token, profile_photo } = useSelector(selectUser)
    const intl = useIntl()
    const [openPicker, setOpenPicker] = useState(false);

    const handleLikeComment = () => {
        setclicked(prev => !prev)
        setLikesLocal(
            prev => prev !== 0 && clicked === false ? prev + 1 : prev === 0 ? prev + 1 : prev -1 
        )
    }

    const makeSubComment = event => {
        event.preventDefault()
        axios.put(`/api/post/${commentId}/comment/sub`, { text: textLocal, respondTo: user._id  }, { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data }) => handleAddSub(data) )
        .catch((r) => console.log(r))
        setTextLocal('')
    }
       
    const onEmojiClick = (_, emojiObject) => {
        setTextLocal(textLocal + emojiObject.emoji);
    };

    return (
    <div>
        <div className={styles.meta_t} style={{ textDecoration: 'none' }}>
            <Link className={styles.n} to={`/account/profile/${user._id}`}>
                <img src={user.profile_photo} alt='user_img'/>
            </Link>
            <div className={styles.meta_content}>
                <Link className={styles.n} to={`/account/profile/${user._id}`}>
                    <h6 className={styles.name}>{ user.name } { user.lastName }</h6>
                </Link>
                <p className={styles.text}>
                    <Link className={styles.n} to={`/account/profile/${respondTo._id}`}>
                        <span className={styles.respondTo}>@{respondTo.name} {respondTo.lastName} </span> 
                    </Link>
                    
                    { text }
                </p>
                <span className={styles.comment_likes}>{likesLocal}</span>
            </div>
        </div>
           <div className={styles.capa_two}>
                <button className={styles.button} onClick={handleLikeComment} >{ translate('action-like') }</button>
                <button className={styles.button} onClick={() => setReply(prev => !prev)}>{ translate('respond') }</button>
                 <time className={styles.time}>{parserCommentTime( )}</time>
            </div>

        {reply && <div className={styles.inpu}>
                     <div className={styles.container}>
            <img className={styles.image} src={profile_photo} alt='user_profile' />
            <form className={styles.form} onSubmit={makeSubComment} >
                <div className={styles.respond}>
                    <span className={styles.respond_name}>@{props.user.name.split(' ')[0]}</span>
                    <input value={textLocal} onChange={({ target }) => setTextLocal(target.value)} className={styles.input_respond}   placeholder={intl.formatMessage({ id: 'write-comment' })}  />
                </div>
            </form>
            <div className={styles.picker} >
                {openPicker ? <Picker onEmojiClick={onEmojiClick} /> : null}
            </div>
            <svg className={styles.emoji}  onClick={() => setOpenPicker(prev => !prev)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
            </svg>
            <button className={styles.send} onClick={makeSubComment}>enviar</button>
        </div>
                </div>}
    </div>
    )
}

export default SubComment
