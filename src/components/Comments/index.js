import { useEffect, useState, useContext } from "react"
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios"
import { selectUser } from '../../features/userSlice'
import Comment, { CommentSkeleton } from "../Comment"
import styles from './Comments.module.css'
import Input from '../Input'
import { updateCommentsLength } from "../../features/postSlice"
import socketContext from '../useSocketContext'

const Comments = props => {

    const { id, shouldLoadComments, userid } = props
    const [ comments, setComments ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    const { socket } = useContext(socketContext)

    useEffect(() => {
        if(shouldLoadComments) {        
            setLoading(true)
            axios.get(`${process.env.REACT_APP_HOST}/api/post/${id}`, { headers: { Authorization: `Bearer ${user.token}` } })
                .then(({ data }) => {
                    setComments(data.comments)
                    setLoading(false)
                }) 
        }
        
    }, [id, shouldLoadComments])

    const makeComment = (setText, text) => {
        
        setText('')
        axios.put(`${process.env.REACT_APP_HOST}/api/post/${id}/comment`, { text }, { headers: { Authorization: `Bearer ${user.token}` } })
            .then(
                ({ data }) => {
                    dispatch(updateCommentsLength({postId: id, newId: data._id}))
                    setComments(prev => [...prev, data])
                }
            )
        socket.emit('onComment', userid)
    }

    return (

        <div className={styles.commentContainer}>
        {/* <h1>{userid}</h1> */}
            <div className={styles.comments}>
                {
                    loading
                    ? [1].map(key => <CommentSkeleton key={key} />)
                    : comments.map(
                        comment => <Comment 
                            key={comment._id} 
                            setLoading={setLoading}
                            {...comment}
                        />) 
                }   
            </div>
            <Input action={makeComment}  />
        </div>
    )
}

export default Comments