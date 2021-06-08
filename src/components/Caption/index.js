import styles from './Caption.module.css'

const Caption = props => {

    const { message } = props

    return (
        <div className={styles.container}>
            <p>{message}</p>
        </div>
    )
}

export default Caption
