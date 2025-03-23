// File: server/models/Quiz.js
import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    // The type of question: "isTrue", "multipleChoice", or "multipleSteps"
    type: {
      type: String,
      required: true,
      enum: ["isTrue", "multipleChoice", "multipleSteps"],
    },
    // Common field for all questions.
    questionText: { type: String, required: true },

    // isTrue-specific: a Boolean answer.
    correctAnswer: {
      type: Boolean,
      required: function () {
        return this.type === "isTrue";
      },
    },

    // multipleChoice-specific: an array of options.
    // Each option is an object with text and a flag if it is correct.
    options: {
      type: [
        {
          text: { type: String, required: true },
          isCorrect: { type: Boolean, required: true },
        },
      ],
      required: function () {
        return this.type === "multipleChoice";
      },
    },

    // multipleSteps-specific: an array of steps (could be questions or instructions) 
    // and an answer for each step.
    steps: {
      type: [
        {
          stepText: { type: String, required: true },
          correctAnswer: { type: String, required: true },
        },
      ],
      required: function () {
        return this.type === "multipleSteps";
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);