import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Question type is required"], // Add a custom error message
      enum: ["oneAnswer", "multipleChoice", "multipleAnswer"],
    },
    questionText: {
      type: String,
      required: true,
    },
    infoImage: {
      type: String, // Cloudinary image URL for informational purposes
      required: false,
    },
    options: [
      {
        option: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
        image: {
          type: String, // Cloudinary image URL
          required: false,
        },
      },
    ],
    customAnswers: [
      {
        answer: {
          type: String,
          required: true,
        },
        image: {
          type: String, // Cloudinary image URL
          required: false,
        },
      },
    ],
    correctAnswers: {
      type: [String], // For multi-answer questions
      required: function () {
        return this.type === "multipleAnswer";
      },
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: false,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: false,
    },
    images: [
      {
        type: String, // Cloudinary image URLs
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure a Question can only belong to one Lesson or one Quiz
QuestionSchema.pre("save", function (next) {
  if (this.quizId && this.lessonId) {
    return next(new Error("A Question can only belong to one Lesson or one Quiz, not both."));
  }
  next();
});

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);