import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import connectDB from "../../../../server/config/database";
import { updateChild } from "../../../../server/services/childService";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  
  try {
    await connectDB();
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { childId } = req.query;
    if (!childId) {
      return res.status(400).json({ error: "Child ID is required." });
    }

    const { fullName, password, age } = req.body;
    if (!fullName || !password || !age) {
      return res.status(400).json({ error: "All fields (fullName, password, age) are required." });
    }

    const updatedChild = await updateChild({
      childId,
      fullName,
      password,
      age,
      requesterRole: session.user.role,
      requesterEmail: session.user.email,
    });

    return res.status(200).json({ message: "Child updated successfully", child: updatedChild });
  } catch (error) {
    console.error("Error updating child:", error);
    return res.status(500).json({ error: error.message });
  }
}