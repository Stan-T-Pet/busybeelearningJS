import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    subject: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    content: {
      type: String,
      default: "", // This can be HTML or Markdown content will be rendered in the frontend. have to ask niamh about FIREBASE and CLAUDINARY
    },
  },
  { timestamps: true }
);

export default mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);
