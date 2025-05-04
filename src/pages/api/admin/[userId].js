// File: src/pages/api/admin/users/[userId].js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]";
import connectDB from "../../../server/config/database";
import User from "../../../server/models/User";
import bcryptjs from "bcryptjs";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only." });
  }

  const { userId } = req.query;

  if (req.method === "GET") {
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === "PUT") {
    try {
      const { name, email, password, role } = req.body;
      const updateData = { name, email, role };
      if (password) {
        updateData.password = await bcryptjs.hash(password, 10);
      }
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
      if (!updatedUser) return res.status(404).json({ error: "User not found" });
      return res.status(200).json({ user: updatedUser });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
