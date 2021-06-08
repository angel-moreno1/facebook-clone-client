import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { addUserPost } from './userSlice'

export const loadManyPosts = createAsyncThunk(
    'posts/loadInitialPosts',
    async ({token, page}, thunkApi) => {
        const { data } = await axios.get(`https://serene-meadow-09460.herokuapp.com/api/post?page=${page}`, { headers: { Authorization: `Bearer ${token}` } }) 
        return data
    }
)

export const cratePost = createAsyncThunk(
    'posts/createPost',
    async ({ postData, socket, token }, { dispatch }) => {
        const { data } = await axios.post(
            'https://serene-meadow-09460.herokuapp.com/api/post/',
            postData,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        
        dispatch(addUserPost(data))
        socket.emit('newPost', data)
        return data
    }
)

const initialState = {
    posts: [],
    isLoading: false,
    hasError: false,
    likeIsLoading: false,
    likeHasError: false,
    ctn: 0
}


const postSlice = createSlice(
    {
        name: 'posts',
        initialState,
        reducers: {
            addCommentsToPost: (state, action) => {
                state.posts = action.payload
            },
            addPost: (state, action) => {
                state.posts.unshift(action.payload)
            },
            giveLike: (state, action) => {
                state.posts.forEach(
                    post => post._id === action.payload.postid ?  post.likes.push(action.payload.userid) : null
                )
            },
            setPost: (state, action) => {
                state.posts = []
            },
            giveLikePostLocal: (state, action) => {
                state.posts.forEach(
                    post => {
                        if(post._id === action.payload.id) {
                            post.likes.push({user: action.payload.user, type: action.payload.type})
                        }
                    } 
                )
            },
            unlike: (state, action) => {
                state.posts.forEach(
                    post => {
                        if(post._id === action.payload.id) {
                            post.likes = post.likes.filter(
                                like => like.user !== action.payload.user
                            )
                        }
                    } 
                )
            },
            updateCommentsLength: (state, action) => {
                state.posts.forEach(
                    post => {
                        if(post._id === action.payload.postId) {
                            post.comments.push(action.payload.newId)
                        }
                    }
                )
            }
        },
        extraReducers: {
            [loadManyPosts.pending]: (state, action) => {
                state.isLoading = true
                state.hasError = false;
            },
            [loadManyPosts.fulfilled]: (state, action) => {
                state.posts = [...state.posts, ...action.payload.posts]
                state.ctn = action.payload.ctn
                state.isLoading = false
                state.hasError = false
            },
            [loadManyPosts.rejected]: (state, action) => {
                state.isLoading = false
                state.hasError = true
            },
            [cratePost.pending]: (state, action) => {
                state.hasError = false;
            },
            [cratePost.fulfilled]: (state, action) => {
                state.posts.unshift(action.payload)
                state.hasError = false
            },
            [cratePost.rejected]: (state, action) => {
                state.hasError = true
            }
        }
    }
)

export const selectPost = state => state.posts

export const { addPost, addCommentsToPost, setPost, giveLikePostLocal, unlike, updateCommentsLength } = postSlice.actions

export default postSlice.reducer