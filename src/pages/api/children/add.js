// File: src/pages/api/children/add.js
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../server/config/database";
import { addChild } from "../../../server/services/childService";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  
  try {
    await connectDB();

    //Use 'getServerSession' to fetch the session
    const session = await getServerSession(req, res, authOptions);
    console.log("Session:", session.user); // Debug output

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Only allow parents or admins to add children.
    if (session.user.role !== "parent" && session.user.role !== "admin") {
      return res.status(403).json({ error: "Only parents or admins can add children here." });
    }
    
    // Destructure required fields from the request body.
    const { fullName, password, age } = req.body;
    if (!fullName || !password || !age) {
      return res.status(400).json({ error: "All fields (fullName, password, age) are required." });
    }
    
    // Use the parent's email from the session.
    const newChild = await addChild({
      fullName,
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
