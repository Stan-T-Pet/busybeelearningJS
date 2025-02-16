import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../../../../server/config/database";
import User from "../../../../server/models/User";
import bcrypt from "bcrypt";

export default NextAuth({
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
          role: user.role || "user" // ✅ Ensure role is always available
        };
      },
    }),
  ],
  session: { 
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user"; // ✅ Ensure role is always stored
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub || token.id; // ✅ Ensure session user ID is always set
      session.user.role = token.role; 
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // ✅ Removed duplicate
  pages: {
    signIn: "/login",
    error: "/error",
  },
  debug: true,
});
