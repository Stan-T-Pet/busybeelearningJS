import mongoose from "mongoose";

// ===== Parent Schema stored in the "parents" collection =====
const ParentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // For example, you might store an array of child IDs
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }],
  role: { type: String, default: "parent" },
});
const Parent = mongoose.models.Parent ||
  mongoose.model("Parent", ParentSchema, "parents");

// ===== Admin Schema stored in the "admins" collection =====
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // For example, you might store admin-specific permissions
  permissions: { type: [String], default: [] },
  role: { type: String, default: "admin" },
});
const Admin = mongoose.models.Admin ||
  mongoose.model("Admin", AdminSchema, "admins");

export { Parent, Admin };
