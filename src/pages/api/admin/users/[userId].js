import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import connectDB from "@/server/config/database";
import { Admin, Parent, Child } from "@/server/models/User";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only." });
  }

  const { id } = req.query;

  const getUserById = async (id) =>
    (await Admin.findById(id)) ||
    (await Parent.findById(id)) ||
    (await Child.findById(id));

  switch (req.method) {
    case "GET":
  try {
    console.log("Fetching user with ID:", userId); // log incoming ID

    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({ user });
  } catch (error) {
    console.error("GET /api/admin/[userId] failed:", error); // log error details
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
    // Additional PUT/DELETE logic can go here
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}