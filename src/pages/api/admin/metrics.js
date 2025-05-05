// File: src/pages/api/admin/metrics.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../server/config/database";
import {Child} from "../../../server/models/User";
import Progress from "../../../server/models/Progress";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only." });
  }

  try {
    const totalUsers = await User.countDocuments();
    const totalChildren = await Child.countDocuments();

    // Example: calculate average quiz score from Progress documents where contentType is 'quiz'
    const quizProgress = await Progress.find({ contentType: "quiz" });
    let averageQuizScore = 0;
    if (quizProgress.length > 0) {
      const totalScore = quizProgress.reduce((acc, curr) => acc + (curr.score || 0), 0);
      averageQuizScore = Math.round(totalScore / quizProgress.length);
    }

    return res.status(200).json({
      metrics: { totalUsers, totalChildren, averageQuizScore },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
