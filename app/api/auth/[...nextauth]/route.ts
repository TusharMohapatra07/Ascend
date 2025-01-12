import NextAuth from "next-auth/next";
import GitHubProvider from "next-auth/providers/github";
import connectDB from "@/app/db/connectDb"; // Ensure the database connection is established
import { User } from "@/utils/db"; // Import the User model

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error nothing to see here
        session.user.id = token.sub as string;
      }
      return session;
    },
    async signIn({ user }) {
      // Connect to the database
      await connectDB();

      // Check if the user already exists
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // Create a new user in the database
        await User.create({
          email: user.email,
          name: user.name || "Unknown",
          imageUrl: user.image || "",
          socials: [],
          location: "",
          bio: "",
          followers: 0,
          following: 0,
          Achiverments: [],
          Organizations: [],
        });
      }

      // Return true to proceed with the sign-in
      return true;
    },
  },
  pages: {
    signIn: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
