// File: src/pages/api/admin/lessons/[id].js

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

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const lesson = await Lesson.findById(id);
      if (!lesson) return res.status(404).json({ error: "Lesson not found" });
      return res.status(200).json({ lesson });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  if (req.method === "PUT") {
    try {
      const updated = await Lesson.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updated) return res.status(404).json({ error: "Lesson not found" });
      return res.status(200).json({ lesson: updated });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deleted = await Lesson.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: "Lesson not found" });
      return res.status(200).json({ message: "Lesson deleted" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
