// File: src/pages/api/admin/metrics.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]";
import connectDB from "@/server/config/database";
import { Admin, Parent, Child } from "@/server/models/User";
import Course from "@/server/models/Course";
import Lesson from "@/server/models/Lesson";
import Quiz from "@/server/models/Quiz";
import Progress from "@/server/models/Progress";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const totalUsers =
      (await Admin.countDocuments()) +
      (await Parent.countDocuments()) +
      (await Child.countDocuments());

    const totalChildren = await Child.countDocuments();
    const totalParents = await Parent.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalLessons = await Lesson.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();

    const quizAttempts = await Progress.find({ type: "quiz" });
    const avgQuizScore =
      quizAttempts.length > 0
        ? quizAttempts.reduce((acc, p) => acc + (p.score || 0), 0) /
          quizAttempts.length
        : 0;

    return res.status(200).json({
      totalUsers,
      totalChildren,
      totalParents,
      totalCourses,
      totalLessons,
      totalQuizzes,
      avgQuizScore: Number(avgQuizScore.toFixed(2)),
    });
  } catch (err) {
    console.error("Metrics API error:", err);
    return res.status(500).json({ error: "Failed to load metrics." });
  }
}