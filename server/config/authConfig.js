import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../database"; // Ensure correct path to your database file
import User from "../models/User"; // Ensure correct path to your User model
import bcrypt from "bcrypt";

const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Connect to the database
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

        // Return user object
        return { id: user._id, name: user.name, email: user.email };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Uses JSON Web Tokens for session management
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user ID to the token if available
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      // Add user ID to the session
      session.user.id = token.id;
      return session;
    },
  },
};

export default authConfig;
