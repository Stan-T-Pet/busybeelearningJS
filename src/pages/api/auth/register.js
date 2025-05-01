import bcrypt from "bcryptjs";
import connectDB from "../../../server/config/database";
// Import named exports from User.js and Child.js
import { Parent, Admin } from "../../../server/models/User";
import Child from "../../../server/models/Child";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    await connectDB();

    // Check if a user already exists in the appropriate collection.
    let existingUser = null;
    if (role === "parent") {
      existingUser = await Parent.findOne({ email });
    } else if (role === "admin") {
      existingUser = await Admin.findOne({ email });
    } else if (role === "child") {
      // Typically, children are not allowed to register directly.
      return res.status(400).json({ error: "Child registration is not allowed directly." });
    } else {
      return res.status(400).json({ error: "Invalid role provided." });
    }

    if (existingUser) {
      return res.status(409).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser = null;

    if (role === "parent") {
      newUser = new Parent({ name, email, password: hashedPassword, role });
    } else if (role === "admin") {
      newUser = new Admin({ name, email, password: hashedPassword, role });
    }

    await newUser.save();
    return res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
