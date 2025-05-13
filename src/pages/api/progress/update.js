import connectDB from "@/server/config/database";
import Progress from "@/server/models/Progress";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Types } from "mongoose";

export default async function handler(req, res) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "child") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { contentId, contentType, action, score = 0 } = req.body;
  const childId = session.user.id;

  if (!contentId || !contentType || !["lesson", "quiz"].includes(contentType)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    const normalizedContentId = new Types.ObjectId(contentId);
    const existing = await Progress.findOne({ childId, contentId: normalizedContentId });

    if (action === "start") {
      if (!existing) {
        await Progress.create({
          childId,
          contentId: normalizedContentId,
          contentType,
          completed: false,
        });
      }
      return res.status(200).json({ message: "Started" });
    }

    if (action === "complete") {
      if (existing) {
        existing.completed = true;
        existing.completedAt = new Date();
        if (contentType === "quiz") {
          existing.score = score;
        }
        await existing.save();
        return res.status(200).json({ message: "Updated" });
      } else {
        await Progress.create({
          childId,
          contentId: normalizedContentId,
          contentType,
          completed: true,
          completedAt: new Date(),
          ...(contentType === "quiz" ? { score } : {}),
        });
        return res.status(200).json({ message: "Created and completed" });
      }
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}