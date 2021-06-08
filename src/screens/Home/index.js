import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import { loadLatestChats, selectChats } from '../../features/chatSlice'
import { loadInitialPost, addPost, selectPost, loadManyPosts} from '../../features/postSlice'
import Post from '../../components/Post'
import NavBar from '../../components/NavBar'
import CreatePost from '../../components/CreatePost'
import SkeletonPost from '../../components/SkeletonPost'
import socketContext from '../../components/useSocketContext'
import styles from './Home.module.css'
import axios from 'axios'
import { getAllFriends, selectHomeState } from '../../features/homeSlice'
import { Link } from 'react-router-dom'
import translate from '../../i18n/translate'
import Caption from '../../components/Caption'

const Home = () => {

    const user =  useSelector(selectUser)
    const { isLoading, hasError, posts, ctn } = useSelector(selectPost)
    const { friends, isLoadingFriends } = useSelector(selectHomeState)
    const dispatch = useDispatch()
    const [suggestions, setSuggestions] = useState({})
    const [page, setPage] = useState(1)
    const { latestMessages } = useSelector(selectChats)

    const { socket } = useContext(socketContext)

    useEffect(() => {
        dispatch(loadLatestChats({id: user.id, token: user.token}))

        axios.get(`https://serene-meadow-09460.herokuapp.com/api/users/user/suggestion/${user.id}`)
            .then(
                ({ data }) => setSuggestions(data) 
            )
    }, [])

    useEffect(() => {
        if(latestMessages.length > 0) {
          latestMessages.map(({reference}) => socket.emit('joinChat', { userId: user.id, ref: reference }))
        }
    }, [latestMessages])

    useEffect(() => {
        document.title = 'Home'
        if(posts.length === 0){
            dispatch(loadManyPosts({token: user.token, page}))
        }
    }, [posts.length, dispatch])

    useEffect(() => {
        if(Object.keys(socket).length > 1) {
            socket.on('newPost', post => {
                dispatch(addPost(post))
            })
        }
    }, [socket])

    useEffect(() => {
        dispatch(getAllFriends(user.id))
    }, [user.friends.length])


    useEffect(() => {
        if(page > 1) {
            dispatch(loadManyPosts({token: user.token, page}))
        }
        
    }, [page])

    const loadMorePosts = () => {
        
    }

    return (
        <div className={styles.container}>
        <NavBar  profile_img={user.profile_photo}/>
        <div className={styles.container_main}>
            <div className={styles.left_container}></div>
            <aside className={styles.left}>
                <div className={styles.left_middle}>
                    <h1 className={styles.sug} >Suggestion</h1>
                    {
                        suggestions.data 
                        ? suggestions.data.length > 0 
                            ? suggestions.data.map(
                            
                            user => (
                                <Link key={user._id} to={`/account/profile/${user._id}`} className={styles.text_dec_none}>
                                    <div className={styles.sug_container} >
                                        <img className={styles.sug_img} src={user.profile_photo} alt='user_img'/>
                                        <p className={styles.text_dec_none}>{user.name} {user.lastName}</p>
                                    </div>
                                </Link>
                            )
                        )
                            : <span>Not suggestions yet</span>
                        : null
                    }
                </div>
           
            </aside>
            <main className={styles.middle}>
                <CreatePost/>
                {
                     hasError
                         ? <Caption message='Was an error in server' />
                         : posts.length >= 1
                             ? posts.map(post => {
                                 return <Post 
                                    key={post._id}
                                    profile_photo={post.user.profile_photo}
                                    userid={post.user._id}
                                    id={post._id}
                                    lastName={post.user.lastName}
                                    name={post.user.name}
                                    time={post.createdAt}
                                    text={post.text}
                                    comments={post.comments}
                                    likes={post.likes} 
                                    im={post.file ? post.file : null }
                                    filling={post.filling}
                                    isShare={post.isShare}
                                    sharedPost={post.sharedPost}
                                />
                             })
                             : null
                }
                {
                    isLoading
                     ? [1, 2].map((key) => <SkeletonPost key={key} />)
                     : null
                }
                {
                    posts.length !== 0 && ctn !== posts.length 
                    ?
                    <button className={styles.lmp} onClick={() => setPage(prev => prev +1)}>
                        Load More Posts
                    </button>
                    : null
                }
            </main>
            <div className={styles.right_conta}> 
                <aside className={styles.right}>
                    <div >
                        <h3 className={styles.contacts} >{ translate('contacts') }</h3>
                        {
                            isLoadingFriends
                            ? <h6>Loading friends...</h6>
                            : hasError
                                ? <h6>Was an error</h6>
                                : friends.length >= 1
                                    ? friends.map(
                                        friend => (
                                            <Link key={friend._id} className={styles.text_dec_none} to={`/account/profile/${friend._id}`}>
                                                <div className={styles.friend_container}>
                                                    <img src={friend.profile_photo} alt={friend.name} />
                                                    <p>{friend.name} {friend.lastName}</p>
                                                </div>
                                            </Link>
                                        )
                                    )
                                    : null
                        }  
                    </div>       
            </aside>
            </div>
 
        </div>
        </div>
    )
}

export default Home
