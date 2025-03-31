// File: src/pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../../../server/config/database";
import User from "../../../server/models/User";
import Child from "../../../server/models/Child";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        let user = await User.findOne({ email: credentials.email });
        let role = user?.role;

        if (!user) {
          user = await Child.findOne({ email: credentials.email }); // find child using their own email
          role = "child"; // Explicitly assign "child" role
        }

        if (!user) throw new Error("No user found with this email.");

        // Verify password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) throw new Error("Invalid credentials.");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role, // Ensure role is passed to session
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXTAUTH_SECRET },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user"; 
      }
      console.log("JWT token:", token);
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id || token.sub;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/error",
  },
  debug: true,
};

export default NextAuth(authOptions);