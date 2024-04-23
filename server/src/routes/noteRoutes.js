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
        postedBy: user._id,
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
        .json({ message: "Note created successfully", noteId: newNote._id });
    } catch (error) {
      console.error("Error creating note:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
