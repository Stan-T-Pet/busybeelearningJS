// File: server/models/Quiz.js
import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    // The type of question
    type: {
      type: String,
      required: true,
      enum: ["isTrue", "multipleChoice", "multipleSteps"],
    },

    questionText: { type: String, required: true },

    correctAnswer: {
      type: Boolean,
      required: function () {
        return this.type === "isTrue";
      },
    },

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

    // ✅ New field: subject for modular filtering
    subject: {
      type: String,
      enum: ["english", "math", "history", "japanese", "html"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
