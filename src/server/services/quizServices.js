// server/services/quizServices.js
import Quiz from "../models/Quiz.js";

export const createQuiz = async (quizData) => {
  const quiz = new Quiz({
    ...quizData,
    courseId: quizData.courseId || null, //link to course
  });
  return await quiz.save();
};

export const getQuizById = async (quizId) => {
  return await Quiz.findById(quizId).populate("courseId");
};

export const getQuizzesByCourse = async (courseId) => {
  return await Quiz.find({ courseId });
};

export const getAllQuizzes = async () => {
  return await Quiz.find();
};
