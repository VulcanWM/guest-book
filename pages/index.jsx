// import LoginButton from '../components/LoginButton'
import Layout from '../components/layout'
import styles from '../styles/home.module.css'
import { useRouter } from 'next/router'
import { useSession, signIn, signOut } from "next-auth/react";


export default function HomePage({ allComments }) {
  const router = useRouter()
  const { msg } = router.query
  const { data: session } = useSession();
  var username;
  if (session) {
    console.log(session.user)
    var userId = session.user.image.split("/u/")[1]
    userId = userId.split("?v=")[0]
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://api.github.com/user/" + userId, false ); 
    xmlHttp.send( null );
    username = JSON.parse(xmlHttp.responseText).login
  }
  return (
    <Layout pageTitle="Home">
      <h1>VulcanWM's GuestBook</h1>
      {msg ?
        <h3 className={styles.red}>{msg}</h3>
      :
        <h3 className={styles.lightfont}>Say hello</h3>
      }
      {!session ? (
        <>
          <button onClick={() => signIn()}>Sign in with GitHub to sign!</button>
        </>
      ) : (
          <>
            <h4>Signed in as {username}</h4>
            <button onClick={() => signOut()}>Sign out</button><br/><br/>
            <form action='/api/comments' method='POST'>
              <label htmlFor="Body">Message</label>
              <br/>
              <input className={styles.message} name="Body" required></input>
              <button className={styles.send} type="submit">Send</button>
            </form>
          </>
          )}
      {/* <LoginButton/> */}
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
  let res = await fetch(process.env.NEXTAUTH_URL + "/api/comments", {
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