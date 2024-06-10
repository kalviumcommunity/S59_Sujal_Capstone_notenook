const { UserModel } = require("../models/UserModel");
const { NoteModel } = require("../models/NoteModel");
const { PostedNoteModel } = require("../models/PostedNoteModel");
const mongoose = require("mongoose");
const { validateData } = require("../validation/validator");
const {
  newNoteJoiSchema,
  updateNoteJoiSchema,
  updateNoteFileReferenceJoiSchema,
} = require("../validation/noteJoiSchemas");

const createNewNote = async (req, res) => {
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
};

const addPostedNote = async (req, res) => {
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

    await UserModel.findByIdAndUpdate(
      _id,
      { $addToSet: { postedNotes: postedNote._id } },
      { new: true }
    );

    return res.status(201).json({ message: "Posted note added successfully" });
  } catch (error) {
    console.error("Error adding posted note:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deletePostedNote = async (req, res) => {
  async (req, res) => {
    const noteId = req.params.noteId;

    try {
      const note = await NoteModel.findById(noteId);

      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      const postedNoteId = note.postedNote;

      if (!postedNoteId) {
        return res.status(400).json({ message: "Note not posted" });
      }

      await PostedNoteModel.findByIdAndDelete(postedNoteId);

      note.postedNote = undefined;
      await note.save();

      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const index = user.postedNotes.indexOf(postedNoteId);
      if (index !== -1) {
        user.postedNotes.splice(index, 1);
      }
      await user.save();

      res.status(204).json({ message: "Posted note deleted successfully" });
    } catch (error) {
      console.error("Error deleting posted note:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

const updateNote = async (req, res) => {
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
};

const deleteNote = async (req, res) => {
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

    const postedNoteId = note.postedNote;

    if (postedNoteId) {
      await PostedNoteModel.findByIdAndDelete(postedNoteId);
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
};

const updateNoteFileReferences = async (req, res) => {
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
};

const deleteNoteFileReferences = async (req, res) => {
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
};

const searchNotes = async (req, res) => {
  try {
    const { searchInput } = req.query;
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
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
};

const getNotes = async (req, res) => {
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
};

const getNote = async (req, res) => {
  try {
    const { documentId } = req.query;

    const note = await NoteModel.findById(documentId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
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
};

const viewNote = async (req, res) => {
  try {
    const { documentId } = req.query;

    function isValidDocumentId(documentId) {
      return mongoose.Types.ObjectId.isValid(documentId);
    }

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
};

module.exports = {
  createNewNote,
  addPostedNote,
  deletePostedNote,
  updateNote,
  deleteNote,
  updateNoteFileReferences,
  deleteNoteFileReferences,
  searchNotes,
  getNotes,
  getNote,
  viewNote,
};
