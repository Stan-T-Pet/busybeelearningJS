// File: src/pages/api/admin/quizzes/index.js

import connectDB from "@/server/config/database";
import Quiz from "@/server/models/Quiz";
import Lesson from "@/server/models/Lessons";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (req.method === "GET") {
    try {
      const quizzes = await Quiz.find({});
      return res.status(200).json({ quizzes });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const { questionText, type, correctAnswer, options, steps, lessonId } = req.body;

      const lesson = await Lesson.findById(lessonId);
      if (!lesson) return res.status(400).json({ error: "Invalid lesson ID" });

      const newQuiz = await Quiz.create({
        questionText,
        type,
        correctAnswer,
        options,
        steps,
        lessonId,
        courseId: lesson.courseId,
      });

      return res.status(201).json({ quiz: newQuiz });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
