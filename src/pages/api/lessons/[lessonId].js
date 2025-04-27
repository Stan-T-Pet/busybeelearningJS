// File: src/pages/api/lessons/[lessonId].js
import connectDB from "../../../server/config/database";
import Lesson from "../../../server/models/Lesson";

export default async function handler(req, res) {
  const {
    query: { lessonId },
    method,
  } = req;

  await connectDB();

  if (method === "GET") {
    try {
      const lesson = await Lesson.findById(lessonId).lean();
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found." });
      }

      // Clean for JSON serialization
      const lessonJSON = JSON.parse(JSON.stringify(lesson));
      return res.status(200).json(lessonJSON);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      return res.status(400).json({ error: "Invalid lesson ID or database error." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${method} not allowed.` });
  }
}
