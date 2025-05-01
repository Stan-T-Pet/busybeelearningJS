// File: src/pages/api/admin/metrics/index.js

import connectDB from "@/server/config/database";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import User from "@/server/models/User";
import Child from "@/server/models/Child";
import Progress from "@/server/models/Progress";

export default async function handler(req, res) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (req.method !== "GET") {
    return res.setHeader("Allow", ["GET"]).status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const totalUsers = await User.countDocuments();
    const totalChildren = await Child.countDocuments();

    const quizProgress = await Progress.find({ contentType: "quiz", completed: true }).lean();

    const scores = quizProgress?.map((p) => p.score ?? 0) || [];
    const averageQuizScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    return res.status(200).json({
      metrics: {
        totalUsers,
        totalChildren,
        averageQuizScore,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/admin/metrics:", error);
    return res.status(500).json({ error: "Failed to fetch metrics" });
  }
}
