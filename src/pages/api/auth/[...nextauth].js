import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../../../server/config/database";
import User from "../../../server/models/User";
import Child from "../../../server/models/Child";
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
        await connectDB();

        // Try to find a parent/admin user first using their email
        let user = await User.findOne({ email: credentials.email });
        let role = user?.role;

        // If not found, attempt to find a child using the auto-generated login email
        if (!user) {
          user = await Child.findOne({ loginEmail: credentials.email });
          if (user) {
            role = "child";
          }
        }

        if (!user) throw new Error("No user found with this email.");

        // Verify password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) throw new Error("Invalid credentials.");

        // Return user details. For a child, use fullName and loginEmail.
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
        token.role = user.role || "user";
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
});