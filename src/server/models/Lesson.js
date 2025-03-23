// File: server/models/Lesson.js
import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String }, // Add other fields as needed
  // Optionally, you can add fields for order, published date, etc.
}, {
  timestamps: true,
});

const Lesson = mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);
export default Lesson;
