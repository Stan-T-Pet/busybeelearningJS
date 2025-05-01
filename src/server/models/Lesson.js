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
      required: false,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    content: {
      type: String,
      default: "", // This will be HTML or Markdown content and will be rendered in the frontend, atleast thats the idea
    },
  },
  { timestamps: true }
);

// Ensure title starts with a capital letter
LessonSchema.pre("save", function (next) {
  if (this.title && typeof this.title === "string") {
    this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);
  }
  next();
});

export default mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);
