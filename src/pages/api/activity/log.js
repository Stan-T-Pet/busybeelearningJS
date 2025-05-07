// File: src/pages/api/activity/log.js
import connectDB from "@/server/config/database";
import ActivityLog from "@/server/models/ActivityLog";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "POST") {
    const { action, contentType, contentId, courseId, metadata } = req.body;
    try {
      const log = await ActivityLog.create({
        userId: session.user.id,
        action,
        contentType,
        contentId,
        courseId,
        metadata,
      });
      return res.status(201).json({ log });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).json({ error: "Method Not Allowed" });
}
