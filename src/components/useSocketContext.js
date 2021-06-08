import { createContext } from "react"
import socketConnect from 'socket.io-client'

const socketContext = createContext(
    { 
      socket: socketConnect('https://serene-meadow-09460.herokuapp.com/'),
      deleteSocket: socket => {
        socket = {}
      }
    }
)

export default socketContext