import connectDB from "../../../server/config/database";
import Quiz from "../../../server/models/Quiz";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { lessonId } = req.query;

  if (!lessonId) {
    return res.status(400).json({ error: "Missing lessonId" });
  }

  try {
    const quizzes = await Quiz.find({ lessonId }).lean();
    return res.status(200).json({ quizzes });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch quizzes" });
  }
}