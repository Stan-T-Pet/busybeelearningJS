const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your account credentials
cloudinary.config();

// Function to upload an image to Cloudinary
const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'your-folder-name' // Optional: Specify a folder in Cloudinary
    });
    return result.secure_url; // This is the URL you can store in MongoDB
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

module.exports = { uploadImage };