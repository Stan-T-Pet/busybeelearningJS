import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import connectDB from "../../../../server/config/database";
import { Admin, Parent, Child } from "../../../../server/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only." });
  }

  switch (req.method) {
    case "GET":
      try {
        const [admins, parents, children] = await Promise.all([
          Admin.find({}).select("-password"),
          Parent.find({}).select("-password"),
          Child.find({}).select("-password"),
        ]);

        const users = [
          ...admins.map((u) => ({
            _id: u._id,
            name: u.fullName || u.name,
            email: u.email,
            role: "admin",
          })),
          ...parents.map((u) => ({
            _id: u._id,
            name: u.fullName || u.name,
            email: u.email,
            role: "parent",
          })),
          ...children.map((u) => ({
            _id: u._id,
            name: u.fullName,
            email: u.parentEmail,
            age: u.age,
            role: "child",
          })),
        ];
        

        return res.status(200).json({ users });
      } catch (error) {
        console.error("GET /api/admin/users error:", error);
        return res.status(500).json({ error: error.message });
      }

    case "POST":
      try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
          return res.status(400).json({ error: "Missing required fields." });
        }

        const Model = role === "admin" ? Admin : role === "parent" ? Parent : null;
        if (!Model) {
          return res.status(400).json({ error: "Unsupported role." });
        }

        const existingUser = await Model.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ error: "User with this email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Model({ name, email, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ user: newUser });
      } catch (error) {
        console.error("POST /api/admin/users error:", error);
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
