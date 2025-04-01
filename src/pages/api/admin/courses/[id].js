//file: pages/api/admin/courses/[id].js

import connectDB from "../../../../server/config/database";
import Course from "../../../../server/models/Course";


export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const course = await Course.findById(id);
        if (!course) return res.status(404).json({ error: "Course not found" });
        return res.status(200).json({ course });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }

    case "PUT":
      try {
        const updated = await Course.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updated) return res.status(404).json({ error: "Course not found" });
        return res.status(200).json({ course: updated });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }

    case "DELETE":
      try {
        const deleted = await Course.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: "Course not found" });
        return res.status(200).json({ message: "Course deleted" });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
