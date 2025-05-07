// File: src/pages/api/admin/import/lesson.js

import connectDB from "../../../../server/config/database";
import Lesson from "../../../../server/models/Lesson";

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
    const inserted = await Lesson.insertMany(data);
    return res.status(201).json({ count: inserted.length });
  } catch (error) {
    console.error("Insert failed:", error);
    return res.status(500).json({ error: error.message });
  }
}