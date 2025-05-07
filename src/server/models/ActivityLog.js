// File: server/models/ActivityLog.js
import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true }, // "viewed lesson", "completed quiz" etc
  contentId: { type: mongoose.Schema.Types.ObjectId },
  contentType: { type: String, enum: ["course", "lesson", "quiz", "page"], required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  metadata: { type: Object }, // store the scores or any other relevant data
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.ActivityLog || mongoose.model("ActivityLog", activityLogSchema);
