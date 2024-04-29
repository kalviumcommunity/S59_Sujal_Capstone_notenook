require("dotenv").config();

const express = require("express");
const router = express.Router();
const { UserModel } = require("../models/UserModel");
const { NoteModel } = require("../models/NoteModel");
const passport = require("passport");
const { newNoteJoiSchema } = require("../validation/noteJoiSchemas");
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

      user.notes.push({
        noteId: savedNote._id,
        title,
        subject,
        updatedOn: savedNote.updatedAt,
      });

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
      const UserNotes = await UserModel.findById(req.user.id).select("notes");

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

module.exports = router;
