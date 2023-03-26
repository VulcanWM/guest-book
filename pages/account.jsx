import React from 'react'
import{useSession, signOut, getSession} from 'next-auth/react'
import styles from '../styles/home.module.css'

const account = () => {
const {data:session} = useSession()
    if(session) {
        return (
            <div>
                <p><img src={session.user.image} alt="" className={styles.ghpic} />
            signed In as {session.user.email} 
                Welcome, {session.user.name}</p>
                <button className={styles.signOut} onClick={() => signOut()}>Sign out</button>
            </div>
        )
    } 
}

export const getServerSideProps = async (context) => {
    const session = await getSession(context);
    if(!session){
        return{
            redirect: {
                destination: '/login'
            }
        }
    }
    return {
        props: { session },
    };
}

export default account