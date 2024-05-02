require("dotenv").config();

const express = require("express");
const router = express.Router();
const { UserModel } = require("../models/UserModel");
const { NoteModel } = require("../models/NoteModel");
const passport = require("passport");
const {
  newNoteJoiSchema,
  updateNoteJoiSchema,
  updateNoteFileReferenceJoiSchema,
} = require("../validation/noteJoiSchemas");
const { validateData } = require("../validation/validator");

router.post(
  "/createNewNote",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await UserModel.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { title, subject } = req.body;

      const validationResult = validateData(
        { title, subject },
        newNoteJoiSchema
      );

      if (validationResult.error) {
        return res
          .status(400)
          .json({ message: validationResult.error.details[0].message });
      }

      const newNote = new NoteModel({
        postedBy: { userId: user._id, username: user.username },
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
  }
);

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

router.get(
  "/searchNotes",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { searchInput } = req.query;
      console.log(searchInput);

      const escapedSearchInput = escapeRegExp(searchInput);

      const query = {
        $or: [
          { title: { $regex: escapedSearchInput, $options: "i" } },
          { subject: { $regex: escapedSearchInput, $options: "i" } },
        ],
      };

      const notes = await NoteModel.find(query);

      return res.status(200).json({ notes });
    } catch (error) {
      console.error("Error searching notes:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get(
  "/getNotes",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
  }
);

router.get(
  "/getNote",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { documentId } = req.query;

      const note = await NoteModel.findById(documentId);

      const noteData = {
        title: note.title,
        subject: note.subject,
      };

      res.json({ note: noteData });
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.patch(
  "/updateNote",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { noteId, title, subject } = req.body;

      console.log(noteId, title, subject);
      const validationResult = validateData(
        {
          title,
          subject,
        },
        updateNoteJoiSchema
      );

      if (validationResult.error) {
        return res
          .status(400)
          .json({ message: validationResult.error.details });
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

      res.json({ message: "Note updated successfully", note });
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.patch(
  "/updateNoteFileReferences",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { noteId, fileName, url } = req.body;

      const validationResult = validateData(
        { noteId, fileName, url },
        updateNoteFileReferenceJoiSchema
      );

      if (validationResult.error) {
        return res
          .status(400)
          .json({ message: validationResult.error.details });
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
  }
);

module.exports = router;
