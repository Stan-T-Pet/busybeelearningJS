const mongoose = require('mongoose');

const ChildSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  parentEmail: { type: String, required: true },
  loginEmail: { type: String, unique: true },
  // other fields...
});

// Pre-save hook to auto-generate loginEmail
ChildSchema.pre('save', function(next) {
  if (this.isNew) {
    // Ensure parent's email is present
    if (!this.parentEmail) {
      return next(new Error('Parent email is required'));
    }
    // Auto-generate loginEmail if not provided
    if (!this.loginEmail) {
      let generatedUsername = this.fullName.trim().toLowerCase().replace(/\s+/g, '.');
      generatedUsername = generatedUsername.replace(/[^a-z0-9.]/g, ''); // remove invalid characters
      this.loginEmail = `${generatedUsername}@busybeelearning.ie`;
    }
  }
  next();
});

module.exports = mongoose.models.Child || mongoose.model('Child', ChildSchema);