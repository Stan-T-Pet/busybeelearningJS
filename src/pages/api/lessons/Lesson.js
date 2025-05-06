import connectDB from "../../../server/config/database";
import Lesson from "../../../server/models/Lesson";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userRole = session.user.role;

  if (req.method === "GET") {
    try {
      if (userRole !== "child" && userRole !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }

      const lessons = await Lesson.find({}).lean();
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
      if (userRole !== "admin") {
        return res.status(403).json({ error: "Only admins can add lessons" });
      }

      const { title, description, subject, content } = req.body;
      if (!title || !subject) {
        return res.status(400).json({ error: "Title and subject are required." });
      }

      const lesson = new Lesson({ title, description, subject, content });
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