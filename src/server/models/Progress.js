// File: src/server/models/Progress.js

import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: true,
    },
    contentType: {
      type: String,
      enum: ["lesson", "quiz"],
      required: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number,
      default: 0,
    },
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
    timestamps: true,
  }
);

// Ensure uniqueness for each child-content pair
ProgressSchema.index(
  { childId: 1, contentId: 1 },
  { unique: true, partialFilterExpression: { contentId: { $exists: true } } }
);

// Force Mongoose to use "progresses" collection in MongoDB
const Progress =
  mongoose.models.Progress || mongoose.model("Progress", ProgressSchema, "progresses");

export default Progress;