import { createContext } from "react"
import socketConnect from 'socket.io-client'

const socketContext = createContext(
    { 
      socket: socketConnect(`${process.env.REACT_APP_HOST}/`),
      deleteSocket: socket => {
        socket = {}
      }
    }
)

export default socketContext