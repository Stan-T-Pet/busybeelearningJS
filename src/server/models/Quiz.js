// File: server/models/Quiz.js
import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
  prompt: { type: String, required: true },        // The question prompt, e.g., "Spell 'accommodate'"
  answer: { type: String, required: true },          // The correct answer, e.g., "accommodate"
  options: [{ type: String }],                       // (Optional) List of options if it's a multiple choice quiz
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook to update the updatedAt field.
QuizSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
