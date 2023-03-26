import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";

const options = {
    
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],
}

export default (req, res) => NextAuth(req, res, options)