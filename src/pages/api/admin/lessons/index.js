// File: src/pages/api/admin/lessons/index.js

import connectDB from "../../../../server/config/database";
import Lesson from "../../../../server/models/Lesson";
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
      const lessons = await Lesson.find({});
      return res.status(200).json({ lessons });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, description, subject, courseId } = req.body;
      const lesson = await Lesson.create({
        title,
        description,
        subject,
        courseId,
      });
      return res.status(201).json({ lesson });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
