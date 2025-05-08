const mongoose = require("mongoose");
require("dotenv").config(); // Loads MONGODB_URI from .env

const Quiz = require("../server/models/Quiz.js"); // Fixed path

const wrapLatex = (str) => {
  if (!str || typeof str !== "string") return str;

  let cleaned = str.trim();

  // Replace $...$ with \( ... \)
  cleaned = cleaned.replace(/\$(.+?)\$/g, (_, math) => `\\(${math.trim()}\\)`);

  // Only wrap if not already wrapped
  if (!cleaned.startsWith("\\(") && !cleaned.startsWith("\\[")) {
    cleaned = `\\( ${cleaned} \\)`;
  }

  return cleaned;
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const quizzes = await Quiz.find();

    let updatedCount = 0;

    for (let quiz of quizzes) {
      const original = quiz.questionText;
      const cleaned = wrapLatex(original);

      if (cleaned !== original) {
        quiz.questionText = cleaned;
        await quiz.save();
        updatedCount++;
      }
    }

    console.log(` Updated ${updatedCount} quizzes.`);
    process.exit(0);
  } catch (err) {
    console.error(" Error cleaning quiz text:", err);
    process.exit(1);
  }
})();