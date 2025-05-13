// file: src\pages\api\progress\getChildProgress.js
import connectDB from "../../../server/config/database";
import Progress from "../../../server/models/Progress";
import Lesson from "../../../server/models/Lesson";
import Quiz from "../../../server/models/Quiz";
import Enrollment from "../../../server/models/Enrollment";
import Course from "../../../server/models/Course";

export default async function handler(req, res) {
  await connectDB();

  // Prevent caching of progress data
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  const { childId } = req.query;
  if (!childId) return res.status(400).json({ error: "Missing childId" });

  try {
    // Get courses the child is enrolled in
    const enrollments = await Enrollment.find({ childId }).lean();
    const enrolledCourseIds = enrollments.map((e) => e.courseId.toString());

    const courses = await Course.find({ _id: { $in: enrolledCourseIds } }).lean();
    const courseTitleMap = {};
    courses.forEach((c) => (courseTitleMap[c._id.toString()] = c.title));

    // Get child's progress records
    const progressRecords = await Progress.find({ childId }).lean();
    const completedLessons = new Map();
    const completedQuizzes = new Map();

    progressRecords.forEach((p) => {
      if (p.contentType === "lesson") completedLessons.set(p.contentId.toString(), p);
      if (p.contentType === "quiz") completedQuizzes.set(p.contentId.toString(), p);
    });

    // Gather all lessons under enrolled courses
    const allLessons = await Lesson.find({ courseId: { $in: enrolledCourseIds } }).lean();
    const lessonProgress = allLessons.map((l) => {
      const p = completedLessons.get(l._id.toString());
      return {
        title: l.title,
        courseId: l.courseId,
        courseTitle: courseTitleMap[l.courseId.toString()] || "Unknown",
        progress: p ? 100 : 0,
        completedAt: p?.completedAt || null,
      };
    });

    // Gather all quizzes under enrolled courses
    const allQuizzes = await Quiz.find({ courseId: { $in: enrolledCourseIds } }).lean();
    const quizProgress = allQuizzes.map((q) => {
      const p = completedQuizzes.get(q._id.toString());
      return {
        title: q.title,
        courseId: q.courseId,
        courseTitle: courseTitleMap[q.courseId.toString()] || "Unknown",
        score: p?.score || 0,
        totalScore: q.steps?.length || 1,
        completedAt: p?.completedAt || null,
      };
    });

    // Sort most recent first
    lessonProgress.sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
    quizProgress.sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));

    return res.status(200).json({
      lessons: lessonProgress,
      quizzes: quizProgress,
    });
  } catch (err) {
    console.error("Progress fetch error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}