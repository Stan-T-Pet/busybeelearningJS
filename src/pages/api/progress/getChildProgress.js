import connectDB from "@/server/config/database";
import Progress from "@/server/models/Progress";
import Lesson from "@/server/models/Lesson";
import Quiz from "@/server/models/Quiz";
import Enrollment from "@/server/models/Enrollment";
import Course from "@/server/models/Course";
import { Types } from "mongoose";

export default async function handler(req, res) {
  await connectDB();

  const { childId } = req.query;
  if (!childId) return res.status(400).json({ error: "Missing childId" });

  try {
    const enrollments = await Enrollment.find({ childId }).lean();
    const enrolledCourseIds = enrollments.map((e) => e.courseId.toString());
    const courseObjectIds = enrolledCourseIds.map((id) => new Types.ObjectId(id));

    const courses = await Course.find({ _id: { $in: courseObjectIds } }).lean();
    const courseTitleMap = {};
    courses.forEach((c) => {
      courseTitleMap[c._id.toString()] = c.title;
    });

    const progressRecords = await Progress.find({ childId }).lean();

    const completedLessons = new Map();
    const completedQuizzes = new Map();

    progressRecords.forEach((p) => {
      const id = p.contentId.toString();
      if (p.contentType === "lesson") completedLessons.set(id, p);
      if (p.contentType === "quiz") completedQuizzes.set(id, p);
    });

    const allLessons = await Lesson.find({ courseId: { $in: courseObjectIds } }).lean();
    const lessonProgress = allLessons.map((l) => {
      const p = completedLessons.get(l._id.toString());
      return {
        title: l.title,
        courseId: l.courseId,
        courseTitle: courseTitleMap[l.courseId.toString()] || "Unknown",
        progress: p?.completed ? 100 : 0,
        completedAt: p?.completedAt || p?.createdAt || null,
      };
    });

    const allQuizzes = await Quiz.find({ courseId: { $in: courseObjectIds } }).lean();
    const quizProgress = allQuizzes.map((q) => {
      const p = completedQuizzes.get(q._id.toString());
      return {
        title: q.title,
        courseId: q.courseId,
        courseTitle: courseTitleMap[q.courseId.toString()] || "Unknown",
        score: p?.completed ? p.score : 0,
        totalScore: q.steps?.length || 1,
        completedAt: p?.completedAt || p?.createdAt || null,
      };
    });

    lessonProgress.sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
    quizProgress.sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));

    return res.status(200).json({ lessons: lessonProgress, quizzes: quizProgress });
  } catch (err) {
    console.error("Progress fetch error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}