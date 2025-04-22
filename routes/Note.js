const express = require("express");

const router = express.Router();
const Note = require("../models/Note");

// Get all notes
router.get("/getAllNotes", async (req, res) => {
  try {
    // Retrieve all notes from the database
    const notes = await Note.find(); // `find()` retrieves all records from the collection

    // Send the retrieved notes as a JSON response
    res.json({
      message: "Notes retrieved successfully!",
      notes: notes, // Return the notes data
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve notes", error: error.message });
  }
});

// Add new note
router.post("/add", async (req, res) => {
      try {
        // Destructure the required fields from the request body
        const { title, content, userId } = req.body;
    
        // Check if the required fields are provided
        if (!title || !content || !userId) {
          return res.status(400).json({
            message: "Error: 'title', 'content', and 'userId' are required fields.",
          });
        }
    
        // Create a new note instance with data from the request body
        const newNote = new Note({
          title: req.body.title || "Default Title", // Get title from body or set a default
          content: req.body.content || "Default Content", // Same for content
          userId: req.body.userId || "user123", // Replace with actual user ID
          tags: req.body.tags || [], // Tags can be passed as an array
          isPinned: req.body.isPinned || false, // Default to false if not provided
          isArchived: req.body.isArchived || false,
          isDeleted: req.body.isDeleted || false,
          isLocked: req.body.isLocked || false,
          readOnly: req.body.readOnly || false,
          reminderAt: req.body.reminderAt || null,
        });
    
        // Save the new note to the database
        await newNote.save();
    
        // Send the created note as the response
        res.json({
          message: "Note created successfully!",
          note: newNote, // Optionally return the note data
        });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ message: "Failed to create note", error: error.message });
      }
    });
    

// Get all note by userId
router.get("/getNotesByUserId/:userId", async (req, res) => {
  try {
    // const userId = req.params.userId;
    const userId = req.body.userId;

    // Find all notes that match the userId
    const notes = await Note.find({ userId: userId });

    // Send the retrieved notes as a JSON response
    res.json({
      message: "Notes retrieved successfully!",
      notes: notes, // Return the notes data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve notes",
      error: error.message,
    });
  }
});

// Update a note by userId and noteId
router.patch("/updateNoteById/:userId/:noteId", async (req, res) => {
  try {
    const { userId, noteId } = req.params; // Get from link data
    const {
      title,
      content,
      plainText,
      emoji,
      backgroundColor,
      headerColor,
      tags,
      isPinned,
      isArchived,
      isDeleted,
      isLocked,
      readOnly,
      reminderAt,
    } = req.body; // Get from body data

    // Find the note by ID and check if it belongs to the correct user
    const note = await Note.findOne({ _id: noteId, userId: userId });

    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or does not belong to the user" });
    }

    // Update the note fields based on the provided request body
    note.title = title || note.title;
    note.content = content || note.content;
    note.plainText = plainText || note.plainText;
    note.emoji = emoji || note.emoji;
    note.backgroundColor = backgroundColor || note.backgroundColor;
    note.headerColor = headerColor || note.headerColor;
    note.tags = tags || note.tags;
    note.isPinned = isPinned !== undefined ? isPinned : note.isPinned;
    note.isArchived = isArchived !== undefined ? isArchived : note.isArchived;
    note.isDeleted = isDeleted !== undefined ? isDeleted : note.isDeleted;
    note.isLocked = isLocked !== undefined ? isLocked : note.isLocked;
    note.readOnly = readOnly !== undefined ? readOnly : note.readOnly;
    note.reminderAt = reminderAt || note.reminderAt;

    // Update the `updatedAt` field to the current time
    note.updatedAt = new Date().toISOString();

    // Save the updated note
    await note.save();

    res.json({
      message: "Note updated successfully!",
      note: note, // Return the updated note data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update note",
      error: error.message,
    });
  }
});

// Modifying note safe delete properties
router.patch("/deleteNoteById/:userId/:noteId", async (req, res) => {
  try {
    const { userId, noteId } = req.params;

    // Find the note by ID and check if it belongs to the correct user
    const note = await Note.findOne({ _id: noteId, userId: userId });

    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or does not belong to the user" });
    }

    // Mark the note as deleted by setting `isDeleted` to true
    note.isDeleted = true;
    await note.save();

    res.json({
      message: "Note successfully soft-deleted",
      note: note, // Optionally return the updated note
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete note",
      error: error.message,
    });
  }
});

// Hard delete a note by userId and noteId
router.delete("/deleteNoteById/:userId/:noteId", async (req, res) => {
  try {
    const { userId, noteId } = req.params;

    // Find and delete the note by ID if it belongs to the user
    const deletedNote = await Note.findOneAndDelete({
      _id: noteId,
      userId: userId,
    });

    if (!deletedNote) {
      return res
        .status(404)
        .json({ message: "Note not found or does not belong to the user" });
    }

    res.json({
      message: "Note successfully deleted",
      note: deletedNote, // Optionally return the deleted note data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete note",
      error: error.message,
    });
  }
});

module.exports = router;