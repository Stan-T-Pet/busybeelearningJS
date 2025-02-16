import mongoose from "mongoose";

const ChildSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentEmail: { type: String, required: true }, // ✅ Only store parent email
  password: { type: String, required: true },
  age: { type: Number, required: true },
});

export default mongoose.models.Child || mongoose.model("Child", ChildSchema);
