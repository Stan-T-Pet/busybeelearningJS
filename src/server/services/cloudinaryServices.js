// server/services/cloudinaryService.js

import { v2 as cloudinary } from "../cdn/development.js"; // or production later

export async function uploadToCloudinary(filePath, folderName = "uploads") {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
}
