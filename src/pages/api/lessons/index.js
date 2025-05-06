import connectDB from "../../../server/config/database";
import Lesson from "../../../server/models/Lesson";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userRole = session.user.role;

  if (req.method === "GET") {
    try {
      if (userRole !== "child" && userRole !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }

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
      if (userRole !== "admin") {
        return res.status(403).json({ error: "Only admins can create lessons" });
      }

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