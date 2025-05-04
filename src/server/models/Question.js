import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
    {
        question: {
        type: String,
        required: true,
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
        },
        ],
        answer: {
        type: String,
        required: true,
        },
        quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
        },
        images: [
        {
            type: String,
            required: false,
        },
        ],
    },
    {
        timestamps: true,
    }
    );