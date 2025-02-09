import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../server/config/mongodb"; // Ensure correct MongoDB connection
import connectDB from "../../server/config/database";
import User from "../../server/models/User";
import bcrypt from "bcrypt";

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise), // ✅ Store sessions in MongoDB
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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

        return { id: user._id, name: user.name, email: user.email };
      },
    }),
  ],
  session: {
    strategy: "database", // ✅ Store session in MongoDB instead of JWT
  },
  secret: process.env.NEXTAUTH_SECRET,
});