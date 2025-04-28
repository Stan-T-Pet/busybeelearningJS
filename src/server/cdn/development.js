// file: server/cdn/development.js
import { v2 as cloudinary } from "cloudinary";

// Automatically reads CLOUDINARY_URL from environment variables
cloudinary.config(); 

export default cloudinary;