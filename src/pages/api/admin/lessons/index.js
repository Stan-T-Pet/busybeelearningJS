//file: pages\api\admin\lessons\index.js
import connectDB from "../../../../server/config/database";
import Lesson from "../../../../server/models/Lesson";

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        const lessons = await Lesson.find().populate("courseId"); // ✅ populate course if needed
        return res.status(200).json({ lessons });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }

    case "POST":
      try {
        const { title, description, subject, courseId } = req.body;

        if (!title || !subject) {
          return res.status(400).json({ error: "Title and subject are required." });
        }

        const lesson = new Lesson({ title, description, subject, courseId }); // ✅ save courseId
        await lesson.save();

        return res.status(201).json({ lesson });
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
  }
}
