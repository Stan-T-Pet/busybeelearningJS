// File: src/pages/api/progress/update.js
import connectDB from "../../../server/config/database";
import Progress from "../../../server/models/Progress";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { contentType, contentId, courseId, score = 0, action = "complete" } = req.body;

  if (!contentType || !contentId || !courseId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existing = await Progress.findOne({ childId: session.user.id, contentId, contentType });

    if (existing) {
      existing.completed = true;
      existing.score = score;
      existing.completedAt = new Date();
      await existing.save();
    } else {
      await Progress.create({
        childId: session.user.id,
        contentId,
        contentType,
        courseId,
        score,
        completed: true
      });
    }

    return res.status(200).json({ message: "Progress saved" });
  } catch (err) {
    console.error("Progress update error:", err);
    return res.status(500).json({ error: "Failed to save progress" });
  }
}