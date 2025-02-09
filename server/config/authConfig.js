import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../database"; // Ensure correct MongoDB connection
import User from "../models/User"; // Ensure correct path to your User model
import bcrypt from "bcrypt";

const authConfig = {
  adapter: MongoDBAdapter(clientPromise), // 🔥 Use MongoDB session storage
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await clientPromise; // Connect to MongoDB

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

        return { id: user._id, name: user.name, email: user.email };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database", // 🔥 Use database session storage instead of JWT
  },
};

export default authConfig;