import { useSession, signIn, signOut } from "next-auth/react";
import styles from '../styles/home.module.css'

export default function LoginButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button className={styles.signOut} onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Please sign in to continue <br />
      <button className={styles.signIn} onClick={() => signIn()}>Sign in</button>
    </>
  );
}