import { useEffect, useState } from "react"
import axios from 'axios'
import { Link } from "react-router-dom"

const Verified = (props) =>  {

    const [ success, setSuccess ] = useState(false)
    const [ error, setError ] = useState(false)
    const token = props.match.params.token

    useEffect(() => {
        console.log('si')
        axios.post(`/account/verified/${token}`)
            .then((e) => {
                setSuccess(true)
            })
            .catch(() => {
                setSuccess(false)
                setError(true)
            })
    }, [token])

    return (
        <div>
            {success ? <h1>account verified</h1> : null}
            {error ? <h1>was an error</h1> : null}
            <Link to='/'>Go to Login</Link>
        </div>
    )
}

export default Verified
