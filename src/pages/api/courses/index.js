// File: src/pages/api/courses/index.js

import connectDB from "../../../server/config/database";
import Course from "../../../server/models/Course";
import "../../../server/models/Lesson"; // Ensure population works
import "../../../server/models/Quiz";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      // Allow both admins and children to view courses
      const session = await getServerSession(req, res, authOptions);
      if (!session || !(["admin", "child"].includes(session.user.role))) {
        return res.status(403).json({ error: "Access denied" });
      }

      const courses = await Course.find({})
        .populate("lessons")
        .populate("quizzes");

      return res.status(200).json({ courses });
    } catch (error) {
      console.error("Error in GET /api/courses:", error);
      return res.status(500).json({ error: "Failed to fetch courses" });
    }
  }

  if (req.method === "POST") {
    // Only admins can create courses
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    try {
      const {
        title,
        description,
        subject,
        level,
        imageUrl,
        lessons,
        quizzes
      } = req.body;

      const newCourse = await Course.create({
        title,
        description,
        subject,
        level,
        imageUrl,
        lessons: lessons || [],
        quizzes: quizzes || []
      });

      return res.status(201).json({ course: newCourse });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}