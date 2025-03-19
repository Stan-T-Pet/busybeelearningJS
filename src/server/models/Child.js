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

// Pre-save hook to auto-generate loginEmail if not provided.
ChildSchema.pre("save", function (next) {
  if (this.isNew) {
    if (!this.parentEmail) {
      return next(new Error("Parent email is required"));
    }
    if (!this.loginEmail) {
      let generatedUsername = this.fullName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ".");
      generatedUsername = generatedUsername.replace(/[^a-z0-9.]/g, ""); // remove invalid characters
      this.loginEmail = `${generatedUsername}@busybeelearning.ie`;
    }
  }
  next();
});

module.exports = mongoose.models.Child || mongoose.model("Child", ChildSchema);
