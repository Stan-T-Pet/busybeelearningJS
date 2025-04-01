import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Parent, Admin } from "../../../server/models/User";
import connectDB from "../../../server/config/database";
import bcrypt from "bcrypt";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@domain.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Connect to the database
        await connectDB();

        const { email, password } = credentials;

        // Try finding the user in the Parent collection first
        let user = await Parent.findOne({ email });
        // If not found, try in the Admin collection
        if (!user) {
          user = await Admin.findOne({ email });
        }

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Verify the password with bcrypt
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error("Incorrect password");
        }

        // Return user data (make sure to include id, name, email, and role)
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      // If user is available (i.e. during initial sign in), add the user details to the token.
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Append properties from token to session object.
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
