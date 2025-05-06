// File: src/pages/api/quizzes/isTrue.js
import connectDB from "../../../server/config/database";
import Quiz from "../../../server/models/Quiz";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !(["child", "admin"].includes(session.user.role))) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    await connectDB();
    const quizzes = await Quiz.find({ type: "isTrue" });
    return res.status(200).json({ quizzes });
  } catch (error) {
    console.error("Error fetching isTrue quizzes:", error);
    return res.status(500).json({ error: error.message });
  }
}