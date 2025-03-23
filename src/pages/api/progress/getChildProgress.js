// File: src/pages/api/progress/getChildProgress.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../server/config/database";
import Progress from "../../../server/models/Progress";
import Child from "../../../server/models/Child";

export default async function handler(req, res) {
  await connectDB();

  // Allow only GET requests.
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Validate the session.
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { childId } = req.query;
  if (!childId) {
    return res.status(400).json({ error: "Missing childId parameter." });
  }

  try {
    // If the requester is a parent, ensure the child belongs to them.
    if (session.user.role === "parent") {
      const child = await Child.findById(childId).lean();
      if (!child) {
        return res.status(404).json({ error: "Child not found." });
      }
      if (child.parentEmail !== session.user.email) {
        return res.status(403).json({ error: "Unauthorized: You do not have access to this child's progress." });
      }
    }
    
    // Fetch the progress data for the specified child.
    const progressData = await Progress.find({ childId }).lean();

    return res.status(200).json({ progress: progressData });
  } catch (error) {
    console.error("Error fetching child progress:", error);
    return res.status(500).json({ error: error.message });
  }
}
