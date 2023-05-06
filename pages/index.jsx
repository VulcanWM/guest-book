// import LoginButton from '../components/LoginButton'
import Layout from '../components/layout'
import styles from '../styles/home.module.css'
import { useRouter } from 'next/router'
import { useSession, signIn } from "next-auth/react";
import admins from '../lib/admins';
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]";
import Cookies from 'cookies'

export default function HomePage({ allComments, username, userId }) {
  const router = useRouter()
  const { msg } = router.query
  const { data: session } = useSession({required: true})
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
            <form action='/api/comments' method='POST'>
              <label htmlFor="Body">Message</label>
              <br/>
              <input className={styles.message} name="Body" required></input>
              <button className={styles.send} type="submit">Send</button>
            </form>
          </>
          )}
      <div id="comments" className={styles.comments}>
        {
          allComments['data'].map((key, index) => (
            <div id={index} className={styles.comment}>
              <p><strong>{key['User']}</strong> at <span className={styles.lightfont}>{key['Created']}</span></p> 
              <p>{key['Body']}</p>
              {username != null ? 
              <>
              {key['UserId'] == userId || admins.includes(userId) ?
                <form action={'/api/delete_comment?comment_id=' + key['_id']} method='POST'>
                  <button className={styles.send} type="submit">delete comment</button>
                </form>
              :<></>
              }
              </>
              :
              <></>}
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
  const session = await getServerSession(context.req, context.res, authOptions)
  var username;
  var userId;
  if (session) {
    userId = session.user.image.split("/u/")[1]
    userId = userId.split("?v=")[0]
    const cookies = new Cookies(context.req, context.res)
    if (cookies.get("Username")){
      username = cookies.get("Username")
    } else {
      const resp = await fetch(
        `https://api.github.com/user/${userId}`
      );
      const data = await resp.json();
      username = data['login']
      cookies.set('Username', username)
    }
  }
  return {
    props: { allComments, username, userId },
  };
}