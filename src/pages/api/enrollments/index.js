import connectDB from "../../../server/config/database";
import Enrolment from "../../../server/models/Enrollment";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.id;

  // GET all enrollments for this user
  if (req.method === "GET") {
    try {
      const enrollments = await Enrolment.find({ userId }).lean();
      return res.status(200).json({ enrollments });
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      return res.status(500).json({ error: "Failed to fetch enrollments." });
    }
  }

  // POST enroll in a course
  if (req.method === "POST") {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: "Missing courseId" });
    }

    try {
      const existing = await Enrolment.findOne({ userId, courseId });
      if (existing) {
        return res.status(409).json({ error: "Already enrolled" });
      }

      await Enrolment.create({ userId, courseId });
      return res.status(201).json({ message: "Enrolled successfully" });
    } catch (error) {
      console.error("Enrollment failed:", error);
      return res.status(500).json({ error: "Failed to enroll." });
    }
  }

  // DELETE un-enroll
  if (req.method === "DELETE") {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ error: "Missing courseId" });
    }

    try {
      const removed = await Enrolment.findOneAndDelete({ userId, courseId });
      if (!removed) {
        return res.status(404).json({ error: "Enrollment not found" });
      }

      return res.status(200).json({ message: "Unenrolled successfully" });
    } catch (error) {
      console.error("Unenrollment failed:", error);
      return res.status(500).json({ error: "Failed to un-enroll." });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
