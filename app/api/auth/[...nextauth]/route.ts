import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    // CredentialsProvider({
    //   // The name to display on the sign in form (e.g. "Sign in with...")
    //   name: "email",
    //   credentials: {
    //     username: { label: "Username", type: "text", placeholder: "jsmith" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials, req) {
    //     const { username, password } = credentials || {};
    //     const user = {
    //       name: "harkirat",
    //       id: "2",
    //       username: username,
    //     };
    //
    //     if (user) {
    //       return user;
    //     } else {
    //       return null;
    //     }
    //   },
    // }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
});

export { handler as GET, handler as POST };
