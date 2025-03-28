import mongoose from "mongoose";

<<<<<<< HEAD
<<<<<<< Updated upstream
const UserSchema = new mongoose.Schema({
=======
// ===== Parent Schema stored in the "parents" collection =====
const ParentSchema = new mongoose.Schema({
>>>>>>> aa85a160e49896ed30ca96e45310100bb2956166
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // For example, you might store an array of child IDs
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }],
  role: { type: String, default: "parent" },
});
const Parent = mongoose.models.Parent ||
  mongoose.model("Parent", ParentSchema, "parents");

<<<<<<< HEAD
export default mongoose.models.User || mongoose.model("User", UserSchema);
=======
const { Schema, model, models } = mongoose;

// ===== Parent Schema stored in the "parents" collection =====
const ParentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    children: [{ type: Schema.Types.ObjectId, ref: "Child" }],
    role: { type: String, default: "parent" },
  },
  { timestamps: true }
);

// ===== Admin Schema stored in the "admins" collection =====
const AdminSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    permissions: { type: [String], default: [] },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

// ===== Child Schema stored in the "children" collection =====
const ChildSchema = new Schema(
  {
    fullName: { type: String, required: true },
    parentEmail: { type: String, required: true },
    loginEmail: { type: String, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    role: { type: String, default: "child" },
  },
  { timestamps: true }
);

// Pre-save hook to auto-generate the login email if not provided.
ChildSchema.pre("save", function (next) {
  if (this.isNew && !this.loginEmail) {
    let generatedUsername = this.fullName.trim().toLowerCase().replace(/\s+/g, ".");
    generatedUsername = generatedUsername.replace(/[^a-z0-9.]/g, ""); // remove invalid characters
    this.loginEmail = `${generatedUsername}@busybeelearning.ie`;
  }
  next();
});

const Parent = models.Parent || model("Parent", ParentSchema, "parents");
const Admin = models.Admin || model("Admin", AdminSchema, "admins");
const Child = models.Child || model("Child", ChildSchema, "children");

export { Parent, Admin, Child };
>>>>>>> Stashed changes
=======
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
>>>>>>> aa85a160e49896ed30ca96e45310100bb2956166
