// File: src/pages/api/admin/import/quiz.js

import connectDB from "../../../../server/config/database";
import Quiz from "../../../../server/models/Quiz";

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
    const result = await Quiz.insertMany(data.map(d => ({
      ...d,
      courseId: d.courseId || null,
    })));
    return res.status(201).json({ count: result.length, message: "Quizzes imported." });
  } catch (error) {
    console.error("Error importing quizzes:", error);
    return res.status(500).json({ error: error.message });
  }
}
