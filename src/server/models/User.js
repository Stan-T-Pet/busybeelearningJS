import mongoose from "mongoose";

<<<<<<< Updated upstream
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "parent", "child"], default: "parent" },});

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
