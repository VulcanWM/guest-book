import React from 'react'
import{useSession, signIn, getSession} from 'next-auth/react'
import styles from '../styles/home.module.css'

const login = () => {
const {data: session} = useSession()
console.log(session)

if(session){
    return (
        <>  <p>Welcome, {session.user.name}</p>
        <img src={session.user.image} alt="" className={styles.ghpic} />
            signed In as {session.user.email} <br />
        </>
    )
}
else{
    return(
        <>
            Please sign in to continue<br />
            <button className={styles.signIn} onClick={() => signIn()}>Sign in</button>
        </>
    )
}    
}

export const getServerSideProps = async (context) => {
    const session = await getSession(context);
    if(session){
        return{
            redirect: {
                destination: '/index'
            }
        }
    }
    return {
        props: { session },
    };
}

export default login