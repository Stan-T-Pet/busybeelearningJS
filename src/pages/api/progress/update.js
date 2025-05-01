import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../server/config/database";
import Progress from "../../../server/models/Progress";
import Lesson from "../../../server/models/Lesson";

export default async function handler(req, res) {
  const { method } = req;
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  let { childId, contentId, contentType, courseId, action, score } = req.body;

  if (!childId || !contentId || !contentType || !action) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // 🔧 Try to resolve courseId from lesson if missing
  if (!courseId && contentType === "lesson") {
    try {
      const lesson = await Lesson.findById(contentId);
      if (lesson?.courseId) {
        courseId = lesson.courseId;
      }
    } catch (err) {
      console.warn("Could not resolve courseId from lesson.");
    }
  }

  // Still missing courseId? Return error
  if (!courseId) {
    return res.status(400).json({ error: "courseId is required or could not be resolved." });
  }

  console.log("Progress API request received:", {
    childId,
    contentId,
    contentType,
    courseId,
    action,
    score,
  });

  try {
    if (action === "start") {
      let progress = await Progress.findOne({ childId, contentId, contentType });
      if (!progress) {
        progress = new Progress({
          childId,
          contentId,
          contentType,
          courseId,
          startedAt: new Date(),
        });
      } else {
        progress.startedAt = new Date();
      }

      await progress.save();
      return res.status(200).json({ message: "Progress started.", progress });
    }

    if (action === "complete") {
      let progress = await Progress.findOne({ childId, contentId, contentType });
      if (!progress) {
        progress = new Progress({
          childId,
          contentId,
          contentType,
          courseId,
          startedAt: new Date(),
          completedAt: new Date(),
          completed: true,
          score,
        });
      } else {
        progress.completedAt = new Date();
        progress.completed = true;
        if (score !== undefined) progress.score = score;
      }

      await progress.save();
      return res.status(200).json({ message: "Progress completed.", progress });
    }

    return res.status(400).json({ error: "Invalid action type." });
  } catch (error) {
    console.error("Unexpected error updating progress:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
}
