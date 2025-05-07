// File: src/pages/api/admin/import/course.js

import connectDB from "../../../../server/config/database";
import Course from "../../../../server/models/Course";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { data } = req.body;

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: "Invalid or empty data" });
  }

  try {
    const result = await Course.insertMany(data);
    return res.status(201).json({ count: result.length, message: "Courses imported." });
  } catch (error) {
    console.error("Error importing courses:", error);
    return res.status(500).json({ error: error.message });
  }
}
