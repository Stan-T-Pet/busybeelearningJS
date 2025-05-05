// API route - no React hooks allowed
import connectDB from "@/server/config/database";
import { Admin } from "@/server/models/User";
import bcryptjs from "bcryptjs";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new Admin({ name, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ user: newUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
