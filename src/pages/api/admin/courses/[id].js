// File: src/pages/api/admin/courses/[id].js

import connectDB from "@/server/config/database";
import Course from "@/server/models/Course";
import "@/server/models/Lesson";
import "@/server/models/Quiz";
import { authOptions } from '../../auth/[...nextauth]';
import { getServerSession } from "next-auth/next";


export default async function handler(req, res) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const course = await Course.findById(id)
        .populate("lessons")
        .populate("quizzes");

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      return res.status(200).json({ course });
    } catch (error) {
      console.error("GET course error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "PUT") {
    try {
      const updated = await Course.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      })
        .populate("lessons")
        .populate("quizzes");

      if (!updated) {
        return res.status(404).json({ error: "Course not found" });
      }

      return res.status(200).json({ course: updated });
    } catch (error) {
      console.error("PUT course error:", error);
      return res.status(400).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      console.log("Attempting to delete course:", id);
      const deleted = await Course.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ error: "Course not found" });
      }

      return res.status(200).json({ message: "Course deleted" });
    } catch (error) {
      console.error("DELETE course error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
