// File: src/pages/api/admin/fix/misplacedQuizzes.js

import { fixMisplacedQuizzes } from "../../../../utils/misplacedQuizzes";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const result = await fixMisplacedQuizzes();
    return res.status(200).json(result);
  } catch (err) {
    console.error("Fix failed:", err);
    return res.status(500).json({ error: "Cleanup error." });
  }
}