import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../server/config/database";
import Child from "../../../server/models/Child";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized: Please log in first." });
    }

    const children = await Child.find({ parentEmail: session.user.email });

    return res.status(200).json({ children });
  } catch (error) {
    console.error("Error fetching children:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}