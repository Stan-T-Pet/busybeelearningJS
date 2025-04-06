//file: pages\api\admin\quizzes\index.js
import connectDB from "../../../../server/config/database";
import Quiz from "../../../../server/models/Quiz";

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        const quizzes = await Quiz.find().populate("courseId"); //populate course
        return res.status(200).json({ quizzes });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case "POST":
      try {
        const newQuiz = await Quiz.create(req.body); // expects courseId in body
        return res.status(201).json({ quiz: newQuiz });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }

    default:
      return res.status(405).json({ error: "Method Not Allowed" });
  }
}
