import { useSession, signIn, signOut } from "next-auth/react";
import styles from './LoginButton.module.css';

export default function LoginButton() {
  const { data: session } = useSession();
  if (session) {
    console.log(session.user)
    var userId = session.user.image.split("/u/")[1]
    userId = userId.split("?v=")[0]
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://api.github.com/user/" + userId, false ); 
    xmlHttp.send( null );
    var username = JSON.parse(xmlHttp.responseText).login
    return (
      <>
        Signed in as {username} <br />
        <form action='/api/comments' method='POST'>
          <input name="User" id="title" value={username} required></input>
          <br/>
          <label htmlFor="Body">Message</label>
          <br/>
          <input className={styles.message} name="Body" required></input>
          <button className={styles.send} type="submit">Send</button>
        </form>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
