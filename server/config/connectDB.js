import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is missing from .env file");
}

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return; // ✅ Already connected
  }

  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "BusyBeeLearning", // ✅ Ensure it connects to the correct database
    });
    console.log("✅ MongoDB connected successfully to BusyBeeLearning.");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
