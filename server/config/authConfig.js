import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "database"; // ✅ Ensure MongoDB connection
import User from "../models/User";
import bcrypt from "bcrypt";

const authConfig = {
  adapter: MongoDBAdapter(clientPromise), // ✅ Ensure MongoDB Adapter is used
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await clientPromise; // ✅ Ensure MongoDB connection is established

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid credentials.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, 
        };
      },
    }),
  ],
  session: {
    strategy: "JWT", 
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authConfig;

