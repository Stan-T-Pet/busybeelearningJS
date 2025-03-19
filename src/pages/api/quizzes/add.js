// File: src/pages/api/quizzes/add.js
import connectDB from "../../../server/config/database";
import Quiz from "../../../server/models/Quiz";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();

    const { prompt, answer, options } = req.body;
    if (!prompt || !answer) {
      return res.status(400).json({ error: "Prompt and answer are required." });
    }

    // Create a new quiz document.
    const newQuiz = new Quiz({
      prompt,
      answer,
      options, // This can be omitted or an empty array if not applicable.
    });

    const savedQuiz = await newQuiz.save();

    return res.status(201).json({ message: "Quiz created successfully", quiz: savedQuiz });
  } catch (error) {
    console.error("Error adding quiz:", error);
    return res.status(500).json({ error: error.message });
  }
}
