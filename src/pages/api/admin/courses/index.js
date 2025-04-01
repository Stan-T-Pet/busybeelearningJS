// File: pages/api/admin/courses/index.js

import connectDB from "../../../../server/config/database";
import Course from "../../../../server/models/Course";

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        // Return all courses (with all fields)
        const courses = await Course.find({});
        return res.status(200).json({ courses });
      } catch (error) {
        console.error("GET Error:", error);
        return res.status(500).json({ error: error.message });
      }

    case "POST":
      try {
        const newCourse = await Course.create(req.body);
        return res.status(201).json({ course: newCourse });
      } catch (error) {
        console.error("POST Error:", error);
        return res.status(400).json({ error: error.message });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
