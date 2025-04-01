// File: src/pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../../../server/config/database";
import { Parent, Admin } from "../../../server/models/User";
import Child from "../../../server/models/Child";
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
      console.log("JWT token:", token);
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id || token.sub,
        role: token.role,
      };
      console.log("Session:", session);
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

export default NextAuth(authOptions);

/*import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import connectDB from "../../../server/config/database";
import { Parent, Admin, Child } from "../../../server/models/User";

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

        const { email, password } = credentials;

        // Try to find user in each role
        const parent = await Parent.findOne({ email });
        if (parent && (await bcrypt.compare(password, parent.password))) {
          return {
            id: parent._id.toString(),
            name: parent.name,
            email: parent.email,
            role: "parent",
          };
        }

        const admin = await Admin.findOne({ email });
        if (admin && (await bcrypt.compare(password, admin.password))) {
          return {
            id: admin._id.toString(),
            name: admin.name,
            email: admin.email,
            role: "admin",
          };
        }

        const child = await Child.findOne({ loginEmail: email }); // loginEmail for children
        if (child && (await bcrypt.compare(password, child.password))) {
          return {
            id: child._id.toString(),
            name: child.fullName,
            email: child.loginEmail,
            role: "child",
            parentEmail: child.parentEmail,
            age: child.age,
          };
        }

        // If none matched
        throw new Error("Invalid email or password.");
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.parentEmail = user.parentEmail || null;
        token.age = user.age || null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.email = token.email;
      if (token.role === "child") {
        session.user.parentEmail = token.parentEmail;
        session.user.age = token.age;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
*/