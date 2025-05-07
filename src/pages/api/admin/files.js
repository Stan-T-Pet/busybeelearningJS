// File: src\pages\api\admin\files.js

import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const datasetsDir = path.join(process.cwd(), "public", "datasets");

  try {
    const files = fs.readdirSync(datasetsDir);

    const allowedExtensions = [".csv", ".json", ".xml"];
    const filtered = files.filter(file =>
      allowedExtensions.includes(path.extname(file).toLowerCase())
    );

    // Return relative paths to public/
    const filePaths = filtered.map(file => `datasets/${file}`);

    res.status(200).json({ files: filePaths });
  } catch (err) {
    console.error("Failed to list dataset files:", err);
    res.status(500).json({ error: "Unable to read datasets directory" });
  }
}