// File: server/models/Child.js
const mongoose = require("mongoose");

const ChildSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    parentEmail: { type: String, required: true },
    loginEmail: { type: String, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
  },
  {
    // Automatically add createdAt and updatedAt fields.
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

// Pre-save hook to auto-generate a unique loginEmail and ensure unique fullName per parent.
ChildSchema.pre("save", async function (next) {
  // Only run for new documents.
  if (this.isNew) {
    // Ensure parent's email is provided.
    if (!this.parentEmail) {
      return next(new Error("Parent email is required"));
    }

    // Ensure the fullName is unique for this parent.
    const duplicateChild = await this.constructor.findOne({
      fullName: this.fullName,
      parentEmail: this.parentEmail,
    });
    if (duplicateChild) {
      return next(new Error("A child with this full name already exists for this parent."));
    }

    // Auto-generate loginEmail if not provided.
    if (!this.loginEmail) {
      // Create a base username from the child's fullName.
      const baseUsername = this.fullName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ".")
        .replace(/[^a-z0-9.]/g, "");
      
      let newLoginEmail = `${baseUsername}@busybeelearning.ie`;
      let counter = 1;
      
      // Check if a child with the generated loginEmail already exists.
      while (await this.constructor.findOne({ loginEmail: newLoginEmail })) {
        newLoginEmail = `${baseUsername}${counter}@busybeelearning.ie`;
        counter++;
      }
      this.loginEmail = newLoginEmail;
    }
  }
  next();
});

module.exports = mongoose.models.Child || mongoose.model("Child", ChildSchema);
