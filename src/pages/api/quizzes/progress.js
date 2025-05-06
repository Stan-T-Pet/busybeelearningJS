// File: src/pages/api/quizzes/progress.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../server/config/database";
import Progress from "../../../server/models/Progress";
import Child from "../../../server/models/Child";

export default async function handler(req, res) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { role, id, email } = session.user;

  try {
    if (req.method === "GET") {
      // Expect a childId query parameter to fetch progress
      const { childId } = req.query;
      if (!childId) {
        return res.status(400).json({ error: "childId query parameter is required." });
      }

      // Parents can only access their children's progress
      if (role === "parent") {
        const child = await Child.findById(childId).lean();
        if (!child || child.parentEmail !== email) {
          return res.status(403).json({ error: "Access denied" });
        }
      }

      const progressRecords = await Progress.find({ childId }).lean();
      return res.status(200).json({ progress: progressRecords });
    }

    if (req.method === "POST") {
      // Extract from request body
      const {
        childId,
        contentType,
        contentId,
        subject,
        startedAt,
        completedAt,
        score,
        attempts,
      } = req.body;

      // Basic validation
      if (!childId || !contentType || !contentId || !subject) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      // Validate parent's ownership of child
      if (role === "parent") {
        const child = await Child.findById(childId).lean();
        if (!child || child.parentEmail !== email) {
          return res.status(403).json({ error: "Access denied" });
        }
      }

      // Save progress
      const newProgress = new Progress({
        childId,
        contentType,
        contentId,
        subject,
        startedAt: startedAt ? new Date(startedAt) : undefined,
        completedAt: completedAt ? new Date(completedAt) : undefined,
        score,
        attempts,
      });

      const savedProgress = await newProgress.save();
      return res.status(201).json({
        message: "Progress recorded successfully",
        progress: savedProgress,
      });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("Error handling quiz progress:", error);
    return res.status(500).json({ error: error.message });
  }
}