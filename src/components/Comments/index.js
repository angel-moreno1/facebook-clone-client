import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import axios from "axios"
import { selectUser } from '../../features/userSlice'
import Comment, { CommentSkeleton } from "../Comment"
import styles from './Comments.module.css'
import Input from '../Input'
import { updateCommentsLength } from "../../features/postSlice"

const Comments = props => {

    const { id, shouldLoadComments } = props
    const [ comments, setComments ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const user = useSelector(selectUser)
    const dispatch = useDispatch()

    useEffect(() => {
        if(shouldLoadComments) {        
            setLoading(true)
            axios.get(`https://serene-meadow-09460.herokuapp.com/api/post/${id}`, { headers: { Authorization: `Bearer ${user.token}` } })
                .then(({ data }) => {
                    setComments(data.comments)
                    setLoading(false)
                }) 
        }
        
    }, [id, shouldLoadComments])

    const makeComment = (setText, text) => {
        console.log('pasda')
        setText('')
        axios.put(`https://serene-meadow-09460.herokuapp.com/api/post/${id}/comment`, { text }, { headers: { Authorization: `Bearer ${user.token}` } })
            .then(
                ({ data }) => {
                    dispatch(updateCommentsLength({postId: id, newId: data._id}))
                    setComments(prev => [...prev, data])
                }
            )
    }

    return (

        <div className={styles.commentContainer}>
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