// File: src/pages/api/quizzes/add.js
import connectDB from "../../../server/config/database";
import Quiz from "../../../server/models/Quiz";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Authenticate and authorise admin
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    await connectDB();

    // Extract fields from body
    const { type, questionText, correctAnswer, options, steps } = req.body;

    // Validate presence of basic fields
    if (!type || !questionText) {
      return res.status(400).json({ error: "type and questionText are required." });
    }

    // Type-specific validations
    if (type === "isTrue" && typeof correctAnswer !== "boolean") {
      return res.status(400).json({ error: "correctAnswer must be a boolean for isTrue questions." });
    }
    if (type === "multipleChoice" && (!options || !Array.isArray(options) || options.length < 2)) {
      return res.status(400).json({ error: "At least two options are required for multipleChoice questions." });
    }
    if (type === "multipleSteps" && (!steps || !Array.isArray(steps) || steps.length === 0)) {
      return res.status(400).json({ error: "At least one step is required for multipleSteps questions." });
    }

    // Create new quiz document
    const newQuiz = new Quiz({
      type,
      questionText,
      correctAnswer: type === "isTrue" ? correctAnswer : undefined,
      options: type === "multipleChoice" ? options : undefined,
      steps: type === "multipleSteps" ? steps : undefined,
    });

    // Save and return quiz
    const savedQuiz = await newQuiz.save();
    return res.status(201).json({ message: "Quiz question added successfully", quiz: savedQuiz });
  } catch (error) {
    console.error("Error adding quiz question:", error);
    return res.status(500).json({ error: error.message });
  }
}