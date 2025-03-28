// server/authOptions.js
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./config/database";
import { Parent, Admin } from "./models/User";
import Child from "./models/Child";
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
        let user = await Parent.findOne({ email: credentials.email });
        let role = user ? "parent" : null;
        if (!user) {
          user = await Admin.findOne({ email: credentials.email });
          role = user ? "admin" : null;
        }
        if (!user) {
          user = await Child.findOne({ loginEmail: credentials.email });
          role = user ? "child" : null;
        }
        if (!user) throw new Error("No user found with this email.");
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) throw new Error("Invalid credentials.");
        return {
          id: user._id.toString(),
          name: role === "child" ? user.fullName : user.name,
          email: role === "child" ? user.loginEmail : user.email,
          role,
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
        token.role = user.role;
      }
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
