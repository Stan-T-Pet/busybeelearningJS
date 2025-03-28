// File: src/pages/api/progress/update.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../server/config/database";
import Progress from "../../../server/models/Progress";

export default async function handler(req, res) {
  const { method } = req;
  await connectDB();

  // Check session
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Expect body: { childId, contentId, contentType, subject, action, score, ... }
  const { childId, contentId, contentType, subject, action, score } = req.body;

  if (method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // For "start" action, create or update a progress doc with startedAt
    if (action === "start") {
      let progress = await Progress.findOne({ childId, contentId, contentType });
      if (!progress) {
        progress = new Progress({
          childId,
          contentId,
          contentType,
          subject,
          startedAt: new Date(),
        });
      } else {
        progress.startedAt = new Date();
      }
      await progress.save();
      return res.status(200).json({ message: "Progress started.", progress });
    }

    // For "complete" action, set completedAt, etc.
    if (action === "complete") {
      let progress = await Progress.findOne({ childId, contentId, contentType });
      if (!progress) {
        // If no record, create one. Or handle error if you want to force start first.
        progress = new Progress({
          childId,
          contentId,
          contentType,
          subject,
          startedAt: new Date(),
        });
      }
      progress.completedAt = new Date();
      if (score !== undefined) progress.score = score;
      await progress.save();
      return res.status(200).json({ message: "Progress completed.", progress });
    }

    // If no recognized action:
    return res.status(400).json({ error: "Invalid action." });
  } catch (error) {
    console.error("Progress update error:", error);
    return res.status(500).json({ error: error.message });
  }
}
