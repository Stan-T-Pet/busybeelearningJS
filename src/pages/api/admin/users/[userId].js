//file: pages\api\admin\users\[userId].js

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import connectDB from "../../../../server/config/database";
import User from "../../../../server/models/User";
import bcryptjs from "bcryptjs";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only." });
  }

  const { userId } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
        return res.status(200).json({ user });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case "PUT":
      try {
        const { name, email, password, role } = req.body;
        const updateData = { name, email, role };

        if (password) {
          updateData.password = await bcryptjs.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
          new: true,
          runValidators: true,
        });

        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        return res.status(200).json({ user: updatedUser });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case "DELETE":
      try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) return res.status(404).json({ error: "User not found" });
        return res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
