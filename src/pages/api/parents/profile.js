import connectDB from "../../../server/config/database";
import User from "../../../server/models/User";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const parent = await User.findById(session.user.id);
    if (!parent || parent.role !== "parent") {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.status(200).json({ parent, children: parent.children || [] });
  } catch (error) {
    console.error("Error fetching parent profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
