// File: server/models/Progress.js
import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: true,
    },
    // contentType can be "lesson" or "quiz"
    contentType: {
      type: String,
      enum: ["lesson", "quiz"],
      required: true,
    },
    // contentId references the specific lesson or quiz document.
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    // Subject the content belongs to.
    subject: {
      type: String,
      enum: ["english", "math", "history"],
      required: true,
    },
    // When the child started the content.
    startedAt: {
      type: Date,
    },
    // When the child completed the content.
    completedAt: {
      type: Date,
    },
    // Overall score if applicable (for quizzes).
    score: {
      type: Number,
      default: 0,
    },
    // Array to track each attempt.
    attempts: [
      {
        attemptDate: { type: Date, default: Date.now },
        result: {
          type: String,
          enum: ["passed", "failed", "incomplete"],
        },
        score: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields.
  }
);

// Compound index to ensure a child cannot have duplicate progress entries for the same content.
ProgressSchema.index(
  { childId: 1, contentId: 1 },
  { unique: true, partialFilterExpression: { contentId: { $exists: true } } }
);

const Progress =
  mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);

export default Progress;
