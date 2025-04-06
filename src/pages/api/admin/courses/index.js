// File: src/pages/api/admin/courses/index.js

import connectDB from "../../../../server/config/database";
import Course from "../../../../server/models/Course";
import "../../../..//server/models/Lesson";
import "../../../..//server/models/Quiz";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (req.method === "GET") {
    try {
      const courses = await Course.find({})
        .populate("lessons")
        .populate("quizzes");
      return res.status(200).json({ courses });
    } catch (error) {
      console.error("Admin GET /courses error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, description, subject, level, imageUrl, lessons, quizzes } = req.body;
      const course = await Course.create({
        title,
        description,
        subject,
        level,
        imageUrl,
        lessons: lessons || [],
        quizzes: quizzes || []
      });
      return res.status(201).json({ course });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
