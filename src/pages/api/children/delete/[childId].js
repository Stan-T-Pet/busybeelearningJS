// File: src/pages/api/children/delete/[childId].js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import connectDB from "../../../../server/config/database";
import { removeChild } from "../../../../server/services/childService";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectDB();

    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { childId } = req.query;
    // Remove the child using the service function. This function will check that:
    // - if the requester is a parent, the child belongs to them.
    // - if the requester is an admin, deletion is allowed.
    await removeChild({
      childId,
      requesterRole: session.user.role,
      requesterEmail: session.user.email,
    });

    return res.status(200).json({ message: "Child deleted successfully" });
  } catch (error) {
    console.error("Error deleting child:", error);
    return res.status(500).json({ error: error.message });
  }
}
