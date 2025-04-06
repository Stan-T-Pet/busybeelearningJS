// File: src/pages/api/courses/[id].js

import connectDB from "../../../server/config/database";
import Course from "../../../server/models/Course";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
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
      return res.status(400).json({ error: error.message });
    }
  }

  if (req.method === "PUT" || req.method === "DELETE") {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (req.method === "PUT") {
      try {
        const updated = await Course.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true
        })
          .populate("lessons")
          .populate("quizzes");

        if (!updated) {
          return res.status(404).json({ error: "Course not found" });
        }

        return res.status(200).json({ course: updated });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    if (req.method === "DELETE") {
      try {
        const deleted = await Course.findByIdAndDelete(id);
        if (!deleted) {
          return res.status(404).json({ error: "Course not found" });
        }
        return res.status(200).json({ message: "Course deleted" });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
