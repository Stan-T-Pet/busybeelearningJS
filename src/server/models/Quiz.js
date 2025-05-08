import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["isTrue", "multipleChoice", "multipleSteps"],
    },
    title: { type: String, required: false },
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

    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
