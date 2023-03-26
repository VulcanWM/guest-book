import { useSession, signIn, signOut } from 'next-auth/react'

export default function Login() {
    const { data: session, status } = useSession()
    const loading = status === 'loading'

    const handleSignIn = (e) => {
        e.preventDefault()
        signIn("github", { callbackUrl: "http://localhost:3000/"})
    }

    const handleSignOut = (e) => {
        e.preventDefault()
        signOut()
    }
    console.log(session)
    return (
        <div>
            {loading && <p>Loading...</p>}
            {!session && (
                <>
                    Not signed in <br />
                    <button onClick={handleSignIn}>Sign in</button>
                </>
            )}
            {session && (
                <>

                    Signed in as {session.user.email} <br />
                    <button onClick={handleSignOut}>Sign out</button>
                </>
            )}
        </div>
    )
}

