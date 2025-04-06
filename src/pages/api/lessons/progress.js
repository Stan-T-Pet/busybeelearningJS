// File: src/pages/api/lessons/progress.js
import connectDB from "../../../server/config/database";
import Progress from "../../../server/models/Progress";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const { childId } = req.query;
      if (!childId) {
        return res.status(400).json({ error: "childId query parameter required" });
      }
      const progress = await Progress.find({ childId });
      return res.status(200).json({ progress });
    } catch (error) {
      console.error("Error fetching progress:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const {
        childId,
        contentType,
        contentId,
        subject,
        courseId,
        score,
      } = req.body;

      if (!childId || !contentType || !contentId || !subject) {
        return res.status(400).json({ error: "Missing required fields in progress data." });
      }

      const newProgress = new Progress({
        childId,
        contentType,
        contentId,
        subject,
        courseId,
        score: score || 0,
        completed: true,
        completedAt: new Date()
      });

      const savedProgress = await newProgress.save();
      return res.status(201).json({ progress: savedProgress });
    } catch (error) {
      console.error("Error saving progress:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "PUT") {
    try {
      const { progressId } = req.query;
      if (!progressId) {
        return res.status(400).json({ error: "Progress ID is required in query." });
      }

      const updatedProgress = await Progress.findByIdAndUpdate(
        progressId,
        req.body,
        { new: true }
      );

      if (!updatedProgress) {
        return res.status(404).json({ error: "Progress record not found." });
      }

      return res.status(200).json({ progress: updatedProgress });
    } catch (error) {
      console.error("Error updating progress:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "PUT"]);
  return res.status(405).json({ error: "Method Not Allowed" });
}
