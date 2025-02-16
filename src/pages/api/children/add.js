import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../server/config/database";
import Child from "../../../server/models/Child";
import User from "../../../server/models/User";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();

    // ✅ Use `getServerSession` to properly fetch the session
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized: Please log in first." });
    }

    const parent = await User.findOne({ email: session.user.email });

    if (!parent || (parent.role !== "parent" && parent.role !== "admin")) {
      return res.status(403).json({ error: "Forbidden: Only parents and admins can add children." });
    }

    const { name, password, age } = req.body;
    if (!name || !password || !age) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newChild = new Child({
      name,
      parentEmail: session.user.email, // ✅ Save parent email instead of child email
      password: hashedPassword,
      age,
    });

    await newChild.save();

    return res.status(201).json({ message: "Child added successfully." });
  } catch (error) {
    console.error("Error adding child:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
