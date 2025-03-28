// File: src/pages/api/quizzes/index.js
import connectDB from "../../../server/config/database";
import Quiz from "../../../server/models/Quiz";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    await connectDB();

    // Optionally filter by type. If no type is provided, return all quizzes.
    const { type } = req.query;
    const filter = type ? { type } : {};
    const quizzes = await Quiz.find(filter);

    return res.status(200).json({ quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return res.status(500).json({ error: error.message });
  }
}
