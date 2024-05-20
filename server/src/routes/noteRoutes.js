const express = require("express");
const router = express.Router();
const { UserModel } = require("../models/UserModel");
const { NoteModel } = require("../models/NoteModel");
const { PostedNoteModel } = require("../models/PostedNoteModel");
const passport = require("passport");
const mongoose = require("mongoose");
const {
  newNoteJoiSchema,
  updateNoteJoiSchema,
  updateNoteFileReferenceJoiSchema,
} = require("../validation/noteJoiSchemas");
const { validateData } = require("../validation/validator");

const authenticateJWT = passport.authenticate("jwt", { session: false });

router.post("/createNewNote", authenticateJWT, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { title, subject } = req.body;

    const validationResult = validateData({ title, subject }, newNoteJoiSchema);

    if (validationResult.error) {
      return res
        .status(400)
        .json({ message: validationResult.error.details[0].message });
    }

    const newNote = new NoteModel({
      postedBy: user._id,
      title,
      subject,
    });

    const savedNote = await newNote.save();

    user.notes.push(savedNote._id);

    await user.save();
    return res
      .status(201)
      .json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    console.error("Error creating note:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

router.get("/searchNotes", authenticateJWT, async (req, res) => {
  try {
    const { searchInput } = req.query;

    const escapedSearchInput = escapeRegExp(searchInput);

    const query = {
      $or: [
        { title: { $regex: escapedSearchInput, $options: "i" } },
        { subject: { $regex: escapedSearchInput, $options: "i" } },
      ],
    };

    const notes = await PostedNoteModel.find(query).populate({
      path: "postedBy",
      select: "username",
    });

    return res.status(200).json({ notes });
  } catch (error) {
    console.error("Error searching notes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/addPostedNote", authenticateJWT, async (req, res) => {
  try {
    const { title, subject, noteId } = req.body;

    if (!title || !subject || !noteId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingNote = await NoteModel.findById(noteId);
    if (!existingNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (existingNote.postedNote) {
      return res.status(400).json({ message: "Note already Posted" });
    }

    const { _id } = req.user;

    const postedNote = new PostedNoteModel({
      postedBy: _id,
      title,
      subject,
      note: noteId,
    });

    await postedNote.save();
    existingNote.postedNote = postedNote._id;
    await existingNote.save();

    return res.status(201).json({ message: "Posted note added successfully" });
  } catch (error) {
    console.error("Error adding posted note:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete(
  "/deletePostedNote/:noteId",
  authenticateJWT,
  async (req, res) => {
    const noteId = req.params.noteId;

    const existingNote = await NoteModel.findById(noteId);
    if (!existingNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    const postedNoteId = existingNote.postedNote;

    if (!postedNoteId) {
      return res.status(400).json({ message: "Note not Posted" });
    }

    try {
      await PostedNoteModel.findByIdAndDelete(postedNoteId);

      existingNote.postedNote = undefined;
      await existingNote.save();

      res.status(204).json({ message: "Posted note deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/getNotes", authenticateJWT, async (req, res) => {
  try {
    const UserNotes = await UserModel.findById(req.user.id)
      .select("notes")
      .populate({
        path: "notes",
        select: "title subject fileReference updatedAt",
        options: { sort: { updatedAt: -1 } },
      });

    if (!UserNotes) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ notes: UserNotes.notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getNote", authenticateJWT, async (req, res) => {
  try {
    const { documentId } = req.query;

    const note = await NoteModel.findById(documentId);

    const noteData = {
      title: note.title,
      subject: note.subject,
      fileReference: note.fileReference,
      postedNote: note.postedNote || null,
    };

    res.json({ note: noteData });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

function isValidDocumentId(documentId) {
  return mongoose.Types.ObjectId.isValid(documentId);
}

router.get("/viewNote", authenticateJWT, async (req, res) => {
  try {
    const { documentId } = req.query;

    if (!isValidDocumentId(documentId)) {
      return res.status(400).json({ error: "Invalid documentId format" });
    }

    const note = await NoteModel.findById(documentId).populate({
      path: "postedBy",
      select: "username",
    });

    res.json({ note: note });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/updateNote", authenticateJWT, async (req, res) => {
  try {
    const { noteId, title, subject } = req.body;

    const validationResult = validateData(
      {
        title,
        subject,
      },
      updateNoteJoiSchema
    );

    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.details });
    }

    if (!noteId) {
      return res.status(400).json({ error: "Note ID is required" });
    }

    const note = await NoteModel.findByIdAndUpdate(
      noteId,
      { title, subject },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    const postedNote = await PostedNoteModel.findOne({ note: noteId });
    if (postedNote) {
      postedNote.title = title;
      postedNote.subject = subject;
      await postedNote.save();
    }

    res.json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/deleteNote/:noteId", authenticateJWT, async (req, res) => {
  try {
    const noteId = req.params.noteId;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }

    const note = await NoteModel.findById(noteId);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (note.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    if (note.postedNote) {
      const postedNote = await PostedNoteModel.findById(note.postedNote);
      if (!postedNote || postedNote.postedBy.toString() !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized access" });
      }

      await PostedNoteModel.findByIdAndDelete(note.postedNote);
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const index = user.notes.indexOf(noteId);
    if (index !== -1) {
      user.notes.splice(index, 1);
    }
    await user.save();

    await NoteModel.findByIdAndDelete(noteId);

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/updateNoteFileReferences", authenticateJWT, async (req, res) => {
  try {
    const { noteId, fileName, url } = req.body;

    const validationResult = validateData(
      { noteId, fileName, url },
      updateNoteFileReferenceJoiSchema
    );

    if (validationResult.error) {
      return res.status(400).json({
        error: "Validation error",
        details: validationResult.error.details,
      });
    }

    const note = await NoteModel.findByIdAndUpdate(
      noteId,
      { fileReference: { fileName, url } },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "File references updated successfully", note });
  } catch (error) {
    console.error("Error updating file references:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete(
  "/deleteNoteFileReferences/:noteId",
  authenticateJWT,
  async (req, res) => {
    try {
      const noteId = req.params.noteId;

      if (!mongoose.Types.ObjectId.isValid(noteId)) {
        return res.status(400).json({ error: "Invalid note ID" });
      }

      const note = await NoteModel.findById(noteId);

      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }

      note.fileReference = undefined;

      await note.save();

      res.json({ message: "File references deleted successfully" });
    } catch (error) {
      console.error("Error deleting file references:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
