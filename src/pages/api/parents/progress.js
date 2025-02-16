import connectDB from "../../../server/config/database";
import Child from "../../../server/models/Child";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();
    const { parentEmail } = req.query;

    if (!parentEmail) {
      return res.status(400).json({ error: "Parent email is required." });
    }

    // Find all children linked to this parent
    const children = await Child.find({ parentEmail });

    if (!children.length) {
      return res.status(404).json({ error: "No children found for this parent." });
    }

    // Fetch children's progress
    const progressData = children.map((child) => ({
      name: child.name,
      lessonProgress: child.lessonsCompleted || 0, // ✅ Standardized name
      quizProgress: child.quizzesCompleted || 0,  // ✅ Standardized name
    }));

    return res.status(200).json({ progress: progressData });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}