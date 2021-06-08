import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'; 
import { logout, selectUser } from '../../features/userSlice'
import { setPost } from '../../features/postSlice'
import { searchUsers } from '../../features/navBarSlice'
import styles from './NavBar.module.css'
import translate from '../../i18n/translate'
import { changeLenguage, selectLenguage } from '../../features/lenguageSlice'

const NavBar = () => {

    const [ query, setQuery ] = useState('')
    const [ showNotifications, setShowNotifications] = useState(false)
    const { profile_photo, name } = useSelector(selectUser)
    const { results, isLoading } = useSelector(state => state.navBar)
    const dispatch = useDispatch()
    const { language } = useSelector(selectLenguage)
    
    const exit = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        dispatch(logout())
        dispatch(setPost())
    }

    const searchUser = event => {
        event.preventDefault()
        if(query) {
            dispatch(searchUsers(query))
        }
    }

    const handleChangeLenguage = () => {
        dispatch(changeLenguage())
    }

    return (
        <>
        <div className={styles.navContainer}></div>
        <div className={styles.nav_bar}>
            <div className={styles.logo_input}>
                <h5>
                    <svg width='2.5rem' height='2.5rem' xmlns="http://www.w3.org/2000/svg" color='rgb(17, 133, 241)'  viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                </h5>
                <form onSubmit={searchUser}>
                    <input onChange={({ target }) => setQuery(target.value)} className={styles.search} placeholder='search on social media' />
                </form>
                    {
                        isLoading
                        ? <NotResults loading={isLoading} query={query}/>
                        : results.length >= 1
                            ? <div className={styles.user_list} >
                                {
                                    results.map(
                                        user => <SearchListUsers key={user._id} {...user}/>
                                    )
                                }
                            </div>
                            : null
                    }              
            </div>

            <div className={styles.mainIcones}>
                <Tippy content={translate('home')}>
                    <Link to='/'>
                        <div  className={styles.circle_button}>
                            <svg xmlns="http://www.w3.org/2000/svg" color='rgb(119, 119, 119)' width='1.5rem' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                    </Link>
                </Tippy>
                <button className={styles.change_language_button} onClick={handleChangeLenguage}>
                    {language === 'es-mx' ? 'change to english' : 'cambiar a español' }
                </button>
                <Tippy content={translate('videos')}>
                     <Link to='/videos'>
                        <div  className={styles.circle_button}> 
                            <svg xmlns="http://www.w3.org/2000/svg" color='rgb(119, 119, 119)' width='1.5rem' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </Link>
                </Tippy>
            </div>
            <div className={styles.rightIcones}>
                <Tippy content={translate('profile')}>
                    <Link to='/account/profile/' className={styles.profile_button_link}>  
                        <div className={styles.profile_button}>
                            {
                                profile_photo
                                    ? (
                                        <>
                                        <img style={{ width: '1.5rem', height: '1.5rem' }} src={profile_photo}  alt={'profile_img'}/>
                                        <span>{name}</span>
                                        </>
                                    )
                                    : <Skeleton width={2.3} height={2.3} circle={true} />
                            } 
                        </div>
                    </Link>
                </Tippy>
                
                <Tippy content={translate('messages')} >
                    <Link to='/account/chats' data-tip='messages' >
                        <div className={styles.circle_button}>
                            <svg xmlns="http://www.w3.org/2000/svg" width='1.5rem' color='rgb(119, 119, 119)' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                    </Link>
                </Tippy>
                <Tippy content='notifications' >
                    <div style={{ position: 'relative', cursor: 'pointer' }} >
                        <div className={styles.notification_container} style={showNotifications ? {display: 'grid'} : {display: 'none'}}>
                            <div className={styles.notification_container_item} >

                            </div>
                        </div>
                        <div  className={styles.circle_button}>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            onClick={() => setShowNotifications(prev => !prev)}  
                            color='rgb(119, 119, 119)'
                            width='1.5rem'fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        </div>
                    </div>
                </Tippy>
                <Tippy content={translate('logout')}>
                    <Link onClick={exit} to='/login'>
                        <div  className={styles.circle_button}>
                            <svg xmlns="http://www.w3.org/2000/svg" color='rgb(119, 119, 119)' width='1.5rem' className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </Link>
                </Tippy>
                
            </div>
    </div>
    </>
    )
}


const SearchListUsers = props => {

    const { name, lastName, profile_photo, _id } = props

    return (
        <Link className={styles.user_list_name} to={`/account/profile/${_id}`}>
            <div className={styles.user_list_card}>
                <img className={styles.user_list_img} src={profile_photo} alt={name}/>
                <p>{name}{' '}{lastName}</p>
            </div>  
        </Link>
    )
}



const NotResults = props => {

    const { loading, query } = props

    return (
        <div className={styles.user_list_card}>
            <p>{ loading ? 'searching users...' : `Not Results for: ${query}` }</p>
        </div>  
    )
}


export default NavBar