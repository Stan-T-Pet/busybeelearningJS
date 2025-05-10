// File: src/pages/api/parents/progress.js
import connectDB from "../../../server/config/database";
import Child from "../../../server/models/Child";
import Progress from "../../../server/models/Progress";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();
    const { parentEmail } = req.query;

    if (!parentEmail) {
      return res.status(400).json({ error: "Parent email is required." });
    }

    const children = await Child.find({ parentEmail }).lean();

    if (!children.length) {
      return res.status(404).json({ error: "No children found for this parent." });
    }

    const progressSummaries = [];

    for (const child of children) {
      const records = await Progress.find({ childId: child._id }).lean();

      const lessonCount = records.filter(r => r.contentType === "lesson").length;
      const quizScores = records
        .filter(r => r.contentType === "quiz")
        .map(r => r.score || 0);

      const avgQuizScore = quizScores.length
        ? (quizScores.reduce((sum, s) => sum + s, 0) / quizScores.length).toFixed(1)
        : 0;

      progressSummaries.push({
        childId: child._id,
        name: child.fullName || child.name || "Unnamed",
        lessonProgress: lessonCount,
        quizProgress: avgQuizScore,
      });
    }

    return res.status(200).json({ progress: progressSummaries });
  } catch (error) {
    console.error("Error fetching parent progress:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}