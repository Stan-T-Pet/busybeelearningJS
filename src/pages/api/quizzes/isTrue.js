// File: src/pages/api/quizzes/isTrue.js
import connectDB from "../../../server/config/database";
import Quiz from "../../../server/models/Quiz";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    await connectDB();
    // Find all quizzes with type "isTrue"
    const quizzes = await Quiz.find({ type: "isTrue" });
    return res.status(200).json({ quizzes });
  } catch (error) {
    console.error("Error fetching isTrue quizzes:", error);
    return res.status(500).json({ error: error.message });
  }
}
