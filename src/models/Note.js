const mongoose = require("mongoose");

// Define the Note Schema
const noteSchema = new mongoose.Schema({
  userId: { type: String, required: true },    
  title: { type: String, required: true },
  content: { type: String, required: true },

  plainText: { type: String, default: "" },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },

  emoji: { type: String, default: null },
  backgroundColor: { type: String, default: null },
  headerColor: { type: String, default: null },

  tags: { type: [String], default: [] },

  isPinned: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  readOnly: { type: Boolean, default: false },

  reminderAt: { type: String, default: null },
});

// Optionally, use a virtual for derived fields, like `updatedAt` auto-updating
noteSchema.pre("save", function (next) {
  if (this.isModified("content") || this.isModified("title")) {
    this.updatedAt = new Date().toISOString(); // Auto-update updatedAt on content/title change
  }
  next();
});

// Create a Model from the Schema
const Note = mongoose.model("Note", noteSchema);

// Export the Model
module.exports = Note;
