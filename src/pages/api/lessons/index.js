import connectDB from "../../../server/config/database";
import Lesson from "../../../server/models/Lesson";

export default async function handler(req, res) {
  await connectDB();
  
  if (req.method === "GET") {
    const { subject } = req.query;
    const lessons = await Lesson.find(subject ? { subject } : {});
    return res.status(200).json({ lessons });
  }

  if (req.method === "POST") {
    try {
      const lesson = await Lesson.create(req.body);
      return res.status(201).json({ lesson });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).end();
}
