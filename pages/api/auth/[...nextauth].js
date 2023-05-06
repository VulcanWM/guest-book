import GithubProvider from "next-auth/providers/github"
import NextAuth from 'next-auth'

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions);
