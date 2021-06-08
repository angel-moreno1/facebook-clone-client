import Skeleton from 'react-loading-skeleton'
import styles from './Comment.module.css'
import translate from '../../i18n/translate'
import replyImg from '../../assets/icons8-curved-arrow-24.png'
import { memo, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import SubComment from '../SubComment'
import parserCommentTime from '../../utils/parserCommentTime'
import { useIntl } from "react-intl";
import Picker from 'emoji-picker-react';
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import loveImg from '../../assets/love.png'

const Comment = memo(props => {

    const [ reply, setReply ] = useState(false)
    const [ likes, setLikes ] = useState(props.likes.length)
    const [ clicked, setclicked ] = useState(false)
    const [ showReplies, setShowReplies ] = useState(false)
    const [ text, setText ] = useState('')
    const [ subComments, setSubComments ] = useState([])
    const [ subCommentError, setSubCommentError ] = useState('')
    const [openPicker, setOpenPicker] = useState(false);
    const intl = useIntl()
    const { token, profile_photo } = useSelector(selectUser)

    const handleLikeComment = () => {
        setclicked(prev => !prev)
        setLikes(
            prev => prev !== 0 && clicked === false ? prev + 1 : prev === 0 ? prev + 1 : prev -1 
        )
    }
    
    const onEmojiClick = (event, emojiObject) => {
        setText(text + emojiObject.emoji);
    };

    const handleAddSub = sub => {
        setSubComments(prev => [...prev, sub])
    }

    useEffect(() => {
     
        axios.get(`https://serene-meadow-09460.herokuapp.com/api/post/${props._id}/comments`)
            .then(({ data }) => {
                setSubComments(data.subcomments)
            })
        
    }, [])


    const makeSubComment = event => {
        event.preventDefault()
        axios.put(`https://serene-meadow-09460.herokuapp.com/api/post/${props._id}/comment/sub`, { text, respondTo: props.user._id  }, { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data }) => {
            console.log(data)
            setSubComments(prev => [...prev, {...data}])
        } )
        .catch((r) => setSubCommentError(r))
        setText('')
    }
    
    return (
        <>
        <div className={styles.container_t}>
            <div className={styles.meta_t}>
                <Link to={`/account/profile/${props.user._id}`}>
                    <img src={props.user.profile_photo} alt='user_img'/>
                </Link>
                <div className={styles.meta_content}>
                <Link className={styles.n} to={`/account/profile/${props.user._id}`}>
                    <h6 className={styles.name}>{ props.user.name } { props.user.lastName }</h6>
                </Link>
                <p className={styles.text}>{ props.text }</p>
                  {/* only is likes is major then 0 */}
                    <span className={styles.comment_likes}>
                        <img src={loveImg} alt='love' style={{width: '1rem', height: '100%'}}/>

                        <span>2</span>
                    </span>
                    
                </div>

            </div>
            
            <div className={styles.capa_two}>
                    <button className={styles.button} onClick={handleLikeComment} >{ translate('action-like') }</button>
                    <button className={styles.button} onClick={() => setReply(prev => !prev)}>{ translate('respond') }</button>
                    <time className={styles.time}>{parserCommentTime(props.createdAt)}</time>
            </div>
            

                <div className={styles.capa_three}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {
                            subComments.length > 0
                            ? showReplies ? subComments.map(subComment => (
                                    <SubComment 
                                        key={subComment._id}
                                        handleAddSub={handleAddSub}
                                        commentId={props._id}
                                        likes={subComment.likes}
                                        createdAt={subComment.createdAt}
                                        text={subComment.text}
                                        user={subComment.user}
                                        respondTo={subComment.respondTo} />
                                ))
                                : <p onClick={() => setShowReplies(true)} ><img src={replyImg} alt='reply'/>see {subComments.length} replies</p>
                            : null
                        }
                    </div>
                    
                </div>
            {reply && <div className={styles.inpu}>
                     <div className={styles.container}>
            <img className={styles.image} src={profile_photo} alt='user_profile' />
            <form className={styles.form} onSubmit={makeSubComment} >
                <div className={styles.respond}>
                    <span className={styles.respond_name}>@{props.user.name.split(' ')[0]}</span>
                    <input value={text} onChange={({ target }) => setText(target.value)} className={styles.input_respond}   placeholder={intl.formatMessage({ id: 'write-comment' })}  />
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
        
        </>
    )
})

export const CommentSkeleton = () => {
    return (
        <div className={styles.container}>
            <div className={styles.images} style={{ marginRight: '0.5rem' }}>
                <Skeleton width={30} height={30} circle/>
            </div>
            <div>
                <div >
                    <h6 className={styles.name}><Skeleton width={100} height={20}/></h6>
                    <p className={styles.text}><Skeleton width={140} height={15}/></p>
                </div>
                <div>
                    <button className={styles.button}><Skeleton width={30}/></button>
                    <button className={styles.button}><Skeleton width={30}/></button>
                    <time className={styles.time}><Skeleton width={30}/></time>
                </div>
            </div>
        </div>
    )
}


export default Comment