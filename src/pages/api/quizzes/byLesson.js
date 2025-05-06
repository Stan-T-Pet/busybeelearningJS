// File: src/pages/api/quizzes/byLesson.js
import connectDB from "../../../server/config/database";
import Quiz from "../../../server/models/Quiz";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();

  // Only allow GET method
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Session check: only admin or child allowed
  const session = await getServerSession(req, res, authOptions);
  if (!session || !(["child", "admin"].includes(session.user.role))) {
    return res.status(403).json({ error: "Access denied" });
  }

  const { lessonId } = req.query;

  // Require lessonId
  if (!lessonId) {
    return res.status(400).json({ error: "Missing lessonId" });
  }

  try {
    const quizzes = await Quiz.find({ lessonId }).lean();
    return res.status(200).json({ quizzes });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch quizzes" });
  }
}