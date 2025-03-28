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

  try {
    if (req.method === "GET") {
      // Expect a childId query parameter to fetch progress.
      const { childId } = req.query;
      if (!childId) {
        return res.status(400).json({ error: "childId query parameter is required." });
      }

      // Authorization: if requester is a parent, verifying the child belongs to them.
      if (session.user.role === "parent") {
        const child = await Child.findById(childId).lean();
        if (!child || child.parentEmail !== session.user.email) {
          return res.status(403).json({ error: "Unauthorized: You do not have access to this child's progress." });
        }
      }

      const progressRecords = await Progress.find({ childId }).lean();
      return res.status(200).json({ progress: progressRecords });
    } else if (req.method === "POST") {
      // Create a new progress record.
      // Expected body: { childId, contentType, contentId, subject, startedAt, completedAt, score, attempts }
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

      // Validate required fields.
      if (!childId || !contentType || !contentId || !subject) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      // Authorization: if the requester is a parent, ensure the child belongs to them.
      if (session.user.role === "parent") {
        const child = await Child.findById(childId).lean();
        if (!child || child.parentEmail !== session.user.email) {
          return res.status(403).json({ error: "Unauthorized: You do not have access to add progress for this child." });
        }
      }

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
      return res
        .status(201)
        .json({ message: "Progress recorded successfully", progress: savedProgress });
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error handling quiz progress:", error);
    return res.status(500).json({ error: error.message });
  }
}
