import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../server/config/mongodb";
import connectDB from "../../../server/config/connectDB";
import User from "../../../server/models/User";
import bcrypt from "bcrypt";

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise), // ✅ Use MongoDB Adapter for session storage
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        await connectDB();

        // Find user by email
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email.");
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid credentials.");
        }

        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  session: {
    strategy: "database", // ✅ Ensure sessions are stored in MongoDB
    maxAge: 30 * 24 * 60 * 60, // 30 days session expiration
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id; // ✅ Store user ID in session
      return session;
    },
  },
  debug: true, // ✅ Enable debugging for detailed logs
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/error",
  },
});