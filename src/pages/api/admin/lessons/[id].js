// file: pages\api\admin\lessons\[id].js
import connectDB from "../../../../server/config/database";
import Lesson from "../../../../server/models/Lesson";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid lesson ID." });
  }

  switch (req.method) {
    case "GET":
      try {
        const lesson = await Lesson.findById(id);
        if (!lesson) return res.status(404).json({ error: "Lesson not found" });
        return res.status(200).json({ lesson });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }

    case "PUT":
      try {
        const { title, description, subject } = req.body;
        if (!title || !subject || !description) {
          return res.status(400).json({ error: "Title and subject are required." });
        }

        const updated = await Lesson.findByIdAndUpdate(
          id,
          { title, description, subject },
          { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ error: "Lesson not found" });
        return res.status(200).json({ lesson: updated });
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }

    case "DELETE":
      try {
        const deleted = await Lesson.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: "Lesson not found" });
        return res.status(200).json({ message: "Lesson deleted" });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }

    default:
      return res.status(405).json({ error: "Method Not Allowed" });
  }
}
