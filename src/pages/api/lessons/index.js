// File: src/pages/api/lessons/index.js
import connectDB from "../../../server/config/database";
import Lesson from "../../../server/models/Lesson";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const { subject } = req.query;
      const filter = subject ? { subject } : {};
      const lessons = await Lesson.find(filter);
      return res.status(200).json({ lessons });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, description, subject, courseId } = req.body;
      if (!title || !subject) {
        return res.status(400).json({ error: "Title and subject are required." });
      }
      const lesson = await Lesson.create({ title, description, subject, courseId });
      return res.status(201).json({ lesson });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
