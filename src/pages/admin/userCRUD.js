// pages/api/admin/users/userCRUD.js
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../../server/config/database";
import User from "../../../../server/models/User";
import Child from "../../../../server/models/Child";
import bcrypt from "bcrypt";
import { addChild } from "../../../../server/services/childService";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Only admins can access this endpoint." });
  }

  if (req.method === "POST") {
    // Determine the type of user to create based on the "role" provided in the request body.
    const { role, name, password, age, email, parentEmail } = req.body;

    if (!role || !name || !password) {
      return res.status(400).json({ error: "Role, name, and password are required." });
    }

    if (role === "child") {
      // For a child, we require a parentEmail and age.
      if (!age || !parentEmail) {
        return res.status(400).json({ error: "Age and parentEmail are required when creating a child." });
      }
      try {
        const newChild = await addChild({
          fullName: name,
          password,
          age,
          parentEmail,
        });
        return res.status(201).json({ message: "Child added successfully", user: newChild });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    } else if (role === "parent") {
      // For a parent, use the existing parent creation logic.
      // For example, ensure an email is provided.
      if (!email) {
        return res.status(400).json({ error: "Email is required for creating a parent." });
      }
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newParent = new User({
          name,
          email,
          password: hashedPassword,
          role: "parent",
        });
        await newParent.save();
        return res.status(201).json({ message: "Parent added successfully", user: newParent });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    } else {
      return res.status(400).json({ error: "Invalid role provided." });
    }
  } else if (req.method === "GET") {
    // You might want to support retrieving users here
    // For example, filter by role if a query param is provided.
    const { role } = req.query;
    try {
      let users;
      if (role === "child") {
        users = await Child.find();
      } else if (role === "parent") {
        users = await User.find({ role: "parent" });
      } else {
        // If no role is provided, return all users (or handle as needed).
        users = await User.find();
      }
      return res.status(200).json({ users });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}