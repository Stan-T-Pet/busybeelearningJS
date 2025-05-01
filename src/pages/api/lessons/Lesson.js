// File: src/pages/api/lessons/Lesson.js
import connectDB from "../../../server/config/database";
import Lesson from "../../../server/models/Lesson";
import { uploadImage } from "../../../server/cdn/claudinary";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      // Fetch all lessons from the database
      const lessons = await Lesson.find({}).lean();
      // Serialize documents (convert ObjectIDs/dates into JSON‐friendly values)
      const lessonsJSON = lessons.map((lesson) =>
        JSON.parse(JSON.stringify(lesson))
      );
      return res.status(200).json({ lessons: lessonsJSON });
    } catch (error) {
      console.error("Error fetching lessons:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    try {
      // Destructure lesson details from the request body.
      const { title, description, subject, content, imagePath } = req.body;
      if (!title || !subject) {
        return res
          .status(400)
          .json({ error: "Title and subject are required." });
      }

      let imageUrl = null;
      if (imagePath) {
        // Upload image to Cloudinary
        imageUrl = await uploadImage(imagePath, "lessons");
      }

      // Create and save the new lesson.
      const lesson = new Lesson({ title, description, subject, content, imageUrl });
      const savedLesson = await lesson.save();
      return res.status(201).json({ lesson: savedLesson });
    } catch (error) {
      console.error("Error adding lesson:", error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
