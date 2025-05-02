import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "database"; // Ensure MongoDB connection
import User from "../models/User";
import Child from "../models/Child";
import bcryptjs from "bcryptjs";

const authConfig = {
  adapter: MongoDBAdapter(clientPromise), // Use the MongoDB Adapter
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Ensure MongoDB connection is established
        await clientPromise;
        
        // Try to find a user in the main User collection first (for parents and admins)
        let user = await User.findOne({ email: credentials.email });
        let role = user ? user.role : null;
        
        // If not found, attempt to find the user in the Child collection using loginEmail
        if (!user) {
          user = await Child.findOne({ loginEmail: credentials.email });
          role = user ? "child" : null;
        }
        
        if (!user) {
          throw new Error("No user found with this email.");
        }
        
        // Validate the provided password
        const isPasswordValid = await bcryptjs.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid credentials.");
        }
        
        // Return the correct fields based on the user's role
        return {
          id: user._id.toString(),
          name: role === "child" ? user.fullName : user.name,
          email: role === "child" ? user.loginEmail : user.email,
          role,
        };
      },
    }),
  ],
  session: { strategy: "JWT" },
  jwt: { secret: process.env.NEXTAUTH_SECRET },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authConfig;
