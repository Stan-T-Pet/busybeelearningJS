import connectDB from "../../../server/config/database";
import Lesson from "../../../server/models/Lesson";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const {
    query: { lessonId },
    method,
  } = req;

  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userRole = session.user.role;

  if (method === "GET") {
    try {
      if (userRole !== "child" && userRole !== "admin") {
        return res.status(403).json({ error: "Access denied" });
      }

      const lesson = await Lesson.findById(lessonId).lean();
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found." });
      }

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
