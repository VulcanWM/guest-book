import Layout from '../components/layout'
import styles from '../styles/home.module.css'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'


export default function HomePage({ allComments }) {
  const router = useRouter()
  const { msg } = router.query
  return (
    <Layout pageTitle="Home">
      <h1>VulcanWM's GuestBook</h1>
      {msg ?
        <h3 className={styles.red}>{msg}</h3>
      :
        <h3 className={styles.lightfont}>Say hello</h3>
      }
      <form action='/api/comments' method='POST'>
        <input name="User" id="title" required></input>
        <br/>
        <label htmlFor="Body">Message</label>
        <br/>
        <input className={styles.message} name="Body" required></input>
        <button className={styles.send} type="submit">Send</button>
      </form>
      <div id="comments" className={styles.comments}>
        {
          allComments['data'].map((key, index) => (
            <div id={index} className={styles.comment}>
              <p><strong>{key['User']}</strong> at <span className={styles.lightfont}>{key['Created']}</span></p> 
              <p>{key['Body']}</p>
            </div>
          ))
        }
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  let res = await fetch("https://vulcanwm-guestbook.vercel.app/api/comments", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let allComments = await res.json();
  return {
    props: { allComments },
  };
}