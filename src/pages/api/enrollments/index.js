// File: src/pages/api/enrollments/index.js
import connectDB from "@/server/config/database";
import Enrollment from "@/server/models/Enrollment";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const userId = session.user.id;

  if (req.method === "POST") {
    const { courseId } = req.body;
    try {
      const enrollment = await Enrollment.findOneAndUpdate(
        { userId, courseId },
        { $setOnInsert: { userId, courseId, enrolledAt: new Date() } },
        { upsert: true, new: true }
      );
      return res.status(201).json({ enrollment });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "GET") {
    const { courseId } = req.query;
    try {
      const enrolled = await Enrollment.exists({ userId, courseId });
      return res.status(200).json({ enrolled: !!enrolled });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.setHeader("Allow", ["POST", "GET"]);
  return res.status(405).json({ error: "Method Not Allowed" });
}
