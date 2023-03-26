import { useSession, signIn, signOut } from "next-auth/react";
import styles from './LoginButton.module.css';

export default function LoginButton() {
  const { data: session } = useSession();
  if (session) {
    console.log(session.user)
    return (
      <>
        Signed in as {session.user.email} <br />
        <form action='/api/comments' method='POST'>
        <input name="User" id="title" required></input>
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
