// pages/api/children/add.js (for parents)
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../server/config/database";
import { addChild } from "../../../server/services/childService";
import User from "../../../server/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  
  try {
    await connectDB();
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Ensure only parents use this endpoint.
    if (session.user.role !== "parent") {
      return res.status(403).json({ error: "Only parents can add children here." });
    }
    
    // Extract data from the request body.
    const { name, password, age } = req.body;
    if (!name || !password || !age) {
      return res.status(400).json({ error: "All fields are required." });
    }
    
    // The parent's email from session is used.
    const newChild = await addChild({
      fullName: name,
      password,
      age,
      parentEmail: session.user.email,
    });
    
    return res.status(201).json({ message: "Child added successfully", child: newChild });
  } catch (error) {
    console.error("Error adding child:", error);
    return res.status(500).json({ error: error.message });
  }
}