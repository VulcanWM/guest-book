// import NextAuth from "next-auth"
// import GithubProvider from "next-auth/providers/github"

// export const authOptions = {
//   // Configure one or more authentication providers
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//     // ...add more providers here
//   ],
//   secret: process.env.SECRET
// }

// export default NextAuth(authOptions)

// --------------- I commented your code so that you can compare between codes easily ---------------

import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn(user, account, profile) {
      return true;
    },
  },
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.SECRET,
  },
});
