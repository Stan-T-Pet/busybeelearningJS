// File: server/services/parentServices.js

import Progress from "../models/Progress.js";
import Child from "../models/Child.js";
import Lesson from "../models/Lesson.js";
import Quiz from "../models/Quiz.js";

export const getProgressByParentEmail = async (email) => {
  if (!email) return [];

  try {
    // Find children of the parent
    const children = await Child.find({ parentEmail: email }).lean();

    const summaries = [];

    for (const child of children) {
      const progressRecords = await Progress.find({ childId: child._id }).lean();

      const completedLessons = progressRecords.filter((p) => p.contentType === "lesson").length;
      const completedQuizzes = progressRecords.filter((p) => p.contentType === "quiz");

      const totalQuizScore = completedQuizzes.reduce((sum, p) => sum + (p.score || 0), 0);
      const avgQuizScore = completedQuizzes.length
        ? (totalQuizScore / completedQuizzes.length).toFixed(1)
        : 0;

      summaries.push({
        childId: child._id.toString(),
        name: child.fullName || "Unnamed",
        age: child.age || null,
        email: child.loginEmail || "",
        lessonProgress: completedLessons,
        quizProgress: avgQuizScore,
      });
    }

    return summaries;
  } catch (error) {
    console.error("getProgressByParentEmail error:", error);
    return [];
  }
};