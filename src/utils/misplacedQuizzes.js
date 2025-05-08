// File: src/utils/misplacedQuizzes.js
import connectDB from "../server/config/database";
import Course from "../server/models/Course";
import Quiz from "../server/models/Quiz";

export async function fixMisplacedQuizzes() {
  await connectDB();

  const misplaced = await Course.find({ question: { $exists: true } });
  if (misplaced.length === 0) return { message: "No misplaced quizzes found.", moved: 0, deleted: 0 };

  const formatted = misplaced.map(doc => ({
    question: doc.question,
    options: doc.options,
    answer: doc.answer,
    courseId: doc.courseId || null,
  }));

  const inserted = await Quiz.insertMany(formatted);
  const deleted = await Course.deleteMany({ _id: { $in: misplaced.map(q => q._id) } });

  return {
    message: "Cleanup complete.",
    moved: inserted.length,
    deleted: deleted.deletedCount,
  };
}