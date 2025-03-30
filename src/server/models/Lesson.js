<<<<<<< Updated upstream
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
=======
import mongoose from "mongoose";

const LessonInfoSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    lesson: { type: String, required: true },
    page: { type: Number, required: true },
    info: { type: [String], required: true },
    examples: { type: [String], required: true },
    images: { type: [String], required: false },
});

export default mongoose.models.LessonInfo || mongoose.model("LessonInfo", LessonInfoSchema);
>>>>>>> Stashed changes
