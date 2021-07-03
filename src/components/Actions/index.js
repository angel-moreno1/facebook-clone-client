import { memo, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import { cratePost, giveLikePostLocal, unlike, } from '../../features/postSlice'
import Comments from '../Comments'
import styles from './Actions.module.css'
import translate from '../../i18n/translate'
import covertReactions from '../../utils/convertReactions'
import likeImg from '../../assets/like.png'
import loveImg from '../../assets/love.png'
import amazesImg from '../../assets/amazes.png'
import laughImg from '../../assets/laugh.png'
import sadImg from '../../assets/sad.png'
import angryImg from '../../assets/angry.png'
import axios from 'axios'
import socketContext from '../useSocketContext'
import getShortenNumber from '../../utils/shortenLongNumber'

const Actions = ({ likes, comments, id, sharedPostId, userid }) => {

    const [commentOpen, setCommentOpen] = useState(false)
    const [liked, setLiked] = useState(likes.length)
    const [likesLocal, setLikesLocal] = useState(likes)
    const [likesType, setLikesType] = useState(null)
    const [clicked, setclicked] = useState(false)
    const [givingLikeLoading, setGivingLikeLoading] = useState(false)
    const [openShare, setOpenShare] = useState(false)
    const [reactionsType, setReactionType] = useState('like')
    const [text, setText] = useState('')
    const user = useSelector(selectUser)
    const [showEmojisPicker, setShowEmojisPicker] = useState(false)
    const [activeshowEmojisPicker, setActiveshowEmojisPicker] = useState(false)
    const { socket } = useContext(socketContext)
    const dispatch = useDispatch()

    const handleLike = () => {
        setclicked(prev => !prev)
        setLiked(
            prev => prev !== 0 && clicked === false ? prev + 1 : prev === 0 && clicked === false ? prev + 1 : prev - 1
        )
        if (clicked === false) {
            dispatch(giveLikePostLocal({ id, user: user.id, type: 'like' }))
            setLikesLocal([...likesLocal, { type: 'like', user: user.id }])
        } else {
            dispatch(unlike({ id, user: user.id }))
            setGivingLikeLoading(true)
            setLikesLocal(prev => prev.filter(like => like.user !== user.id))
        }
        axios.put(`${process.env.REACT_APP_HOST}/api/post/${id}/like`, { type: 'like' }, { headers: { Authorization: `Bearer ${user.token}` } })
            .then(() => setGivingLikeLoading(false))
        setReactionType('like')
    }

    useEffect(() => {
        if (likes.length) {
            likes.forEach(like => {
                if (like.user === user.id) {
                    setclicked(true)
                    setReactionType(like.type)
                }
            })
        }
    }, [])

    const onHoverEmoji = () => setActiveshowEmojisPicker(true)
    const onLeaveEmoji = () => setActiveshowEmojisPicker(false)

    useEffect(() => {
        let timeOutEmojiPiker
        if (activeshowEmojisPicker === true) {
            timeOutEmojiPiker = setTimeout(() => {
                setShowEmojisPicker(true)
            }, 270)
        } else {
            timeOutEmojiPiker = setTimeout(() => {
                setShowEmojisPicker(false)
            }, 100)
        }

        return () => clearTimeout(timeOutEmojiPiker)
    }, [activeshowEmojisPicker])

    useEffect(() => {
        const converted = covertReactions(likesLocal.map(like => like.type))
        setLikesType(converted)
    }, [likes, likesLocal])

    const handleComment = () => {
        setCommentOpen(prev => !prev)
    }

    const changeReactionType = (type) => () => {

        const alreadyGiveLike = likesLocal.find(like => like.user === user.id)
        setGivingLikeLoading(true)
        setActiveshowEmojisPicker(false)
        if (alreadyGiveLike) {
            dispatch(unlike({ id, user: user.id }))
            dispatch(giveLikePostLocal({ id, user: user.id, type }))
            const newLikesLocal = likesLocal.filter(like => like.user !== user.id)
            setLikesLocal([...newLikesLocal, { type, user: user.id }])
            setReactionType(type)
            axios.put(`${process.env.REACT_APP_HOST}/api/post/${id}/u/like`, { type }, { headers: { Authorization: `Bearer ${user.token}` } })
                .then(() => setGivingLikeLoading(false))
        } else {
            dispatch(giveLikePostLocal({ id, user: user.id, type }))
            setclicked(prev => !prev)
            setLiked(
                prev => prev !== 0 && clicked === false ? prev + 1 : prev === 0 && clicked === false ? prev + 1 : prev - 1
            )
            setLikesLocal([...likesLocal, { type, user: user.id }])
            setReactionType(type)
            axios.put(`${process.env.REACT_APP_HOST}/api/post/${id}/like`, { type }, { headers: { Authorization: `Bearer ${user.token}` } })
                .then(() => setGivingLikeLoading(false))
        }
        setGivingLikeLoading(false)
    }

    const sharePost = () => {
        setText('')
        if (text) {
            const data = new FormData()
            data.append('text', text)
            data.append('isShare', true)
            if (sharedPostId) {
                data.append('sharedPost', sharedPostId)
            } else {
                data.append('sharedPost', id)
            }

            dispatch(cratePost({ postData: data, socket, token: user.token }))

            setText('')
            setOpenShare(false)
        }
    }

    const sharedPostToggle = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        setOpenShare(prev => !prev)
    }

    return (
        <div>
            {openShare && (
                <>
                    <div className={styles.share_post_container}>
                        <span onClick={sharedPostToggle} className={styles.share_post_close}>X</span>
                        <div className={styles.share_post_input_container}>
                            <h3>Write something about this post</h3>
                            <span>At least one letter</span>
                            <textarea className={styles.share_post_input} placeholder='write something' value={text} onChange={({ target }) => setText(target.value)} />
                        </div>
                        <button onClick={sharePost}>Share</button>
                    </div>
                    <div onClick={sharedPostToggle} className={styles.share_post_container_capa}></div>
                </>
            )}

            <div className={styles.post_actions}>
                <div className={styles.reactions_comments}>
                    <span className={styles.reaction_reac_container}>
                        {' '}
                        {

                            likesType !== null &&
                            <div className={styles.reaction_img}>
                                {likesType.map(
                                    ({ name }) => name === 'like'
                                        ? <img key={name} src={likeImg} alt='like' />
                                        : name === 'love'
                                            ? <img key={name} src={loveImg} alt='love' />
                                            : name === 'laugh'
                                                ? <img key={name} src={laughImg} alt='laugh' />
                                                : name === 'amazes'
                                                    ? <img key={name} src={amazesImg} alt='amazes' />
                                                    : name === 'sad'
                                                        ? <img key={name} src={sadImg} alt='sad' />
                                                        : name === 'angry'
                                                            ? <img key={name} src={angryImg} alt='angry' />
                                                            : null
                                )}

                            </div>

                        }
                        <span className={styles.info_reactions}>
                            {clicked ? `${liked === 1 ? `${user.name} ${user.lastName}` : `You and ${liked - 1} ${liked - 1 === 1 ? 'other' : 'others'}`}` : liked === 0 ? 'Be the first to react' : getShortenNumber(liked)}
                        </span>
                    </span>
                    <div>
                        <span onClick={handleComment}>{getShortenNumber(comments.length.toString())} {translate('action-comments')}</span>
                        <span className={styles.point}>
                        </span>
                        <span >
                            {getShortenNumber('23908')} Shares
                        </span>
                    </div>


                </div>
                <div className={styles.actions} onMouseLeave={onLeaveEmoji}>
                    <div className={styles.actions_emojis} onClick={() => { }} style={showEmojisPicker ? { display: 'flex' } : { display: 'none' }}>
                        <img src={likeImg} alt='like' onClick={changeReactionType('like')} />
                        <img src={loveImg} alt='love' onClick={changeReactionType('love')} />
                        <img src={laughImg} alt='laugh' onClick={changeReactionType('laugh')} />
                        <img src={amazesImg} alt='amazes' onClick={changeReactionType('amazes')} />
                        <img src={sadImg} alt='sad' onClick={changeReactionType('sad')} />
                        <img src={angryImg} alt='angry' onClick={changeReactionType('angry')} />
                    </div>
                    <button
                        disabled={givingLikeLoading}
                        className={clicked ? styles.clicked : null}
                        onClick={handleLike}
                        onMouseOver={onHoverEmoji}

                        style={reactionsType === 'love' ? { color: 'red' } : reactionsType === 'laugh' || reactionsType === 'amazes' || reactionsType === 'sad' ? { color: 'rgb(248, 248, 113)' } : reactionsType === 'angry' ? { color: 'rgb(243, 131, 55)' } : null}
                    >
                        {
                            reactionsType === 'like'
                                ?
                                liked
                                    ? <svg xmlns="http://www.w3.org/2000/svg" width='1rem' style={{ marginRight: '0.3rem' }} viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                    </svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" width='1rem' style={{ marginRight: '0.3rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                : reactionsType === 'love'
                                    ?
                                    liked
                                        ? <img src={loveImg} alt='love' style={{ width: '1.3rem', height: '1.3rem', marginRight: '0.3rem' }} />
                                        : null
                                    : reactionsType === 'laugh'
                                        ? <img src={laughImg} alt='laugh' style={{ width: '1.3rem', height: '1.3rem', marginRight: '0.3rem' }} />
                                        : reactionsType === 'amazes' ?
                                            <img src={amazesImg} alt='amazes' style={{ width: '1.3rem', height: '1.3rem', marginRight: '0.3rem' }} />
                                            : reactionsType === 'sad' ?
                                                <img src={sadImg} alt='sad' style={{ width: '1.3rem', height: '1.3rem', marginRight: '0.3rem' }} />
                                                : reactionsType === 'angry' ?
                                                    <img src={angryImg} alt='angry' style={{ width: '1.3rem', height: '1.3rem', marginRight: '0.3rem' }} />
                                                    : null
                        }
                        {
                            reactionsType === 'like'
                                ? 'Like'
                                : reactionsType === 'love'
                                    ? 'Love'
                                    : reactionsType === 'laugh'
                                        ? 'Haha'
                                        : reactionsType === 'amazes'
                                            ? 'Wow'
                                            : reactionsType === 'sad'
                                                ? 'Sad'
                                                : reactionsType === 'angry'
                                                    ? 'Angry'
                                                    : null
                        }
                    </button>
                    <button onClick={handleComment} >
                        <svg xmlns="http://www.w3.org/2000/svg" width='1rem' style={{ marginRight: '0.3rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                        {translate('action-comment')}
                    </button>

                    <button onClick={sharedPostToggle}>
                        <svg xmlns="http://www.w3.org/2000/svg" width='1rem' style={{ marginRight: '0.3rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                    </button>
                </div>
            </div>
            <div className={styles.commentsContainer}>
                {
                    commentOpen
                        ? <Comments userid={userid} id={id} shouldLoadComments={comments.length >= 1} commentsLength={comments} />
                        : null
                }
            </div>

        </div>
    )
}

export default memo(Actions)