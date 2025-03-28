// File: src/pages/api/admin/users/index.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import connectDB from "../../../server/config/database";
import User from "../../../server/models/User";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  // Only allow admin users
  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only." });
  }

  if (req.method === "GET") {
    try {
      const users = await User.find({});
      return res.status(200).json({ users });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === "POST") {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password || !role) {
        return res.status(400).json({ error: "Missing required fields." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword, role });
      await newUser.save();
      return res.status(201).json({ user: newUser });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
