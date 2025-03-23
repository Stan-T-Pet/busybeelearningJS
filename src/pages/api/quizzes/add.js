// File: src/pages/api/quizzes/add.js
import connectDB from "../../../server/config/database";
import Quiz from "../../../server/models/Quiz";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  
  try {
    await connectDB();
    const { type, questionText, correctAnswer, options, steps } = req.body;
    
    // Basic validation (expand as needed)
    if (!type || !questionText) {
      return res.status(400).json({ error: "type and questionText are required." });
    }
    
    // For each type, ensure required fields are provided:
    if (type === "isTrue" && typeof correctAnswer !== "boolean") {
      return res.status(400).json({ error: "correctAnswer must be a boolean for isTrue questions." });
    }
    if (type === "multipleChoice" && (!options || !Array.isArray(options) || options.length < 2)) {
      return res.status(400).json({ error: "At least two options are required for multipleChoice questions." });
    }
    if (type === "multipleSteps" && (!steps || !Array.isArray(steps) || steps.length === 0)) {
      return res.status(400).json({ error: "At least one step is required for multipleSteps questions." });
    }
    
    const newQuiz = new Quiz({
      type,
      questionText,
      correctAnswer: type === "isTrue" ? correctAnswer : undefined,
      options: type === "multipleChoice" ? options : undefined,
      steps: type === "multipleSteps" ? steps : undefined,
    });
    
    const savedQuiz = await newQuiz.save();
    return res.status(201).json({ message: "Quiz question added successfully", quiz: savedQuiz });
  } catch (error) {
    console.error("Error adding quiz question:", error);
    return res.status(500).json({ error: error.message });
  }
}
