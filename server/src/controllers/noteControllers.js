const { UserModel } = require("../models/UserModel");
const { NoteModel } = require("../models/NoteModel");
const { PostedNoteModel } = require("../models/PostedNoteModel");
const { verifyNoteAuthor, isOwner } = require("../utils/verifyNoteAuthor");
const { validateData } = require("../validation/validator");
const {
  newNoteJoiSchema,
  updateNoteJoiSchema,
  updateNoteFileReferenceJoiSchema,
} = require("../validation/noteJoiSchemas");

// Utility Functions
const handleValidationError = (res, error) => {
  return res.status(400).json({ message: error });
};

const handleInternalError = (res, error, message) => {
  console.error(message, error);
  return res.status(500).json({ message: "Internal server error" });
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function unauthorizedUserError(res) {
  return res
    .status(401)
    .json({ message: "You are authorized for this action." });
}

// Retrieve Note by ID function
const getNoteById = async (noteId, res) => {
  try {
    const note = await NoteModel.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    return note;
  } catch (error) {
    throw error;
  }
};

// Note Controllers
const createNewNote = async (req, res) => {
  try {
    const { title, subject } = req.body;

    const validationResult = validateData({ title, subject }, newNoteJoiSchema);

    if (validationResult.error) {
      return handleValidationError(res, validationResult.error);
    }

    const newNote = new NoteModel({
      postedBy: req.user.id,
      title,
      subject,
    });

    const savedNote = await newNote.save();

    await UserModel.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { notes: savedNote._id } },
      { new: true }
    );

    return res
      .status(201)
      .json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    return handleInternalError(res, error, "Error creating note:");
  }
};

const addPostedNote = async (req, res) => {
  try {
    const { title, subject, noteId } = req.body;

    const existingNote = await getNoteById(noteId, res);

    if (!isOwner(req.user._id, existingNote.postedBy)) {
      return unauthorizedUserError(res);
    }

    if (existingNote.postedNote) {
      return res.status(400).json({ message: "Note already Posted" });
    }

    const postedNote = new PostedNoteModel({
      postedBy: req.user.id,
      title,
      subject,
      note: noteId,
    });

    await postedNote.save();
    existingNote.postedNote = postedNote._id;
    await existingNote.save();

    await UserModel.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { postedNotes: postedNote._id } },
      { new: true }
    );

    return res.status(201).json({ message: "Posted note added successfully" });
  } catch (error) {
    return handleInternalError(res, error, "Error adding posted note:");
  }
};

const deletePostedNote = async (req, res) => {
  const noteId = req.params.noteId;

  try {
    const note = await getNoteById(noteId, res);

    const postedNoteId = note.postedNote;

    if (!postedNoteId) {
      return res.status(400).json({ message: "Note not posted" });
    }

    const postedNote = await PostedNoteModel.findById(postedNoteId).select(
      "postedBy"
    );
    if (!isOwner(req.user._id, postedNote.postedBy)) {
      return unauthorizedUserError(res);
    }

    await PostedNoteModel.findByIdAndDelete(postedNoteId);

    note.postedNote = undefined;
    await note.save();

    const index = req.user.postedNotes.indexOf(postedNoteId);
    if (index !== -1) {
      req.user.postedNotes.splice(index, 1);
    }
    await req.user.save();

    return res
      .status(204)
      .json({ message: "Posted note deleted successfully" });
  } catch (error) {
    return handleInternalError(res, error, "Error deleting posted note:");
  }
};

const updateNote = async (req, res) => {
  try {
    const { noteId, title, subject } = req.body;

    const validationResult = validateData(
      { title, subject },
      updateNoteJoiSchema
    );

    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error });
    }

    const note = await NoteModel.findById(noteId).select("postedBy");
    if (!isOwner(req.user._id, note.postedBy)) {
      return unauthorizedUserError(res);
    }

    const updatedNote = await NoteModel.findByIdAndUpdate(
      noteId,
      { title, subject },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    const postedNote = await PostedNoteModel.findOne({ note: noteId });
    if (postedNote) {
      postedNote.title = title;
      postedNote.subject = subject;
      await postedNote.save();
    }

    res.json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    return handleInternalError(res, error, "Error updating note:");
  }
};

const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;

    const note = await NoteModel.findById(noteId).select("postedBy");
    if (!isOwner(req.user._id, note.postedBy)) {
      return unauthorizedUserError(res);
    }

    const postedNoteId = note.postedNote;

    if (postedNoteId) {
      await PostedNoteModel.findByIdAndDelete(postedNoteId);
    }

    const update = {
      $pull: { notes: noteId },
    };

    if (note.markedForReview) {
      update.$inc = { reviewListCount: -1 };
    }

    await UserModel.findByIdAndUpdate(req.user.id, update);

    await NoteModel.findByIdAndDelete(noteId);

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    return handleInternalError(res, error, "Error deleting note:");
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

    const note = await NoteModel.findById(noteId).select("postedBy");
    if (!isOwner(req.user._id, note.postedBy)) {
      return unauthorizedUserError(res);
    }

    const updatedNote = await NoteModel.findByIdAndUpdate(
      noteId,
      { fileReference: { fileName, url } },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({
      message: "File references updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    return handleInternalError(res, error, "Error updating file references:");
  }
};

const deleteNoteFileReferences = async (req, res) => {
  try {
    const noteId = req.params.noteId;

    const note = await NoteModel.findById(noteId);

    if (!isOwner(req.user._id, note.postedBy)) {
      return unauthorizedUserError(res);
    }

    note.fileReference = undefined;

    await note.save();

    res.json({ message: "File references deleted successfully" });
  } catch (error) {
    return handleInternalError(res, error, "Error deleting file references:");
  }
};

const searchNotes = async (req, res) => {
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
    return handleInternalError(res, error, "Error searching notes:");
  }
};

const getNotes = async (req, res) => {
  try {
    const UserNotes = await UserModel.findById(req.user.id)
      .select("notes")
      .populate({
        path: "notes",
        select: "title subject fileReference updatedAt markedForReview",
        options: { sort: { updatedAt: -1 } },
      });

    if (!UserNotes) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ notes: UserNotes.notes });
  } catch (error) {
    return handleInternalError(res, error, "Error fetching notes:");
  }
};

const getNote = async (req, res) => {
  try {
    const { documentId } = req.query;

    const note = await getNoteById(documentId, res);

    const noteData = {
      title: note.title,
      subject: note.subject,
      fileReference: note.fileReference,
      postedNote: note.postedNote || null,
    };

    res.json({ note: noteData });
  } catch (error) {
    return handleInternalError(res, error, "Error fetching notes:");
  }
};

const viewNote = async (req, res) => {
  try {
    const { documentId } = req.query;
    const userId = req.user._id;

    const note = await NoteModel.findById(documentId).populate({
      path: "postedBy",
      select: "username",
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    const isOwner = note.postedBy._id.equals(userId);

    let isSaved = false;

    if (!isOwner) {
      const user = await UserModel.findById(userId);
      isSaved = user.savedNotes.some(
        (entry) =>
          entry.originalNote.equals(documentId) ||
          entry.savedNote.equals(documentId)
      );
    }

    res.json({ note, isOwner, isSaved });
  } catch (error) {
    return handleInternalError(res, error, "Error fetching note:");
  }
};

const saveNote = async (req, res) => {
  const userId = req.user._id;
  const noteId = req.params.documentId;

  try {
    const originalNote = await getNoteById(noteId, res);

    const newNote = new NoteModel({
      postedBy: originalNote.postedBy,
      title: originalNote.title,
      subject: originalNote.subject,
      fileReference: originalNote.fileReference,
      document: originalNote.document,
    });

    const savedNewNote = await newNote.save();

    await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          savedNotes: { originalNote: noteId, savedNote: savedNewNote._id },
        },
      },
      { new: true, useFindAndModify: false }
    );

    res.status(201).json(savedNewNote);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteSavedNote = async (req, res) => {
  const userId = req.user._id;
  const noteId = req.params.documentId;

  try {
    const savedNoteEntry = user.savedNotes.find(
      (entry) =>
        entry.savedNote.toString() === noteId ||
        entry.originalNote.toString() === noteId
    );

    if (!savedNoteEntry) {
      return res
        .status(403)
        .json({ error: "Saved note not found in user's saved notes" });
    }

    const note = await NoteModel.findById(savedNoteEntry.savedNote);

    const isMarkedForReview = note?.markedForReview;

    await NoteModel.findByIdAndDelete(savedNoteEntry.savedNote);

    const update = {
      $pull: { savedNotes: { _id: savedNoteEntry._id } },
    };

    if (isMarkedForReview) {
      update.$inc = { reviewListCount: -1 };
    }

    await UserModel.findByIdAndUpdate(userId, update);

    res.status(200).json({ message: "Saved note deleted successfully" });
  } catch (error) {
    console.error("Error deleting saved note:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSavedNotes = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await UserModel.findById(userId).populate({
      path: "savedNotes.savedNote",
      select: "_id title subject markedForReview createdAt",
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const savedNotes = user.savedNotes.map((entry) => ({
      _id: entry._id,
      originalNote: entry.originalNote,
      savedNote: {
        _id: entry.savedNote._id,
        title: entry.savedNote.title,
        subject: entry.savedNote.subject,
        markedForReview: entry.savedNote.markedForReview,
        createdAt: entry.savedNote.createdAt,
      },
    }));

    res.status(200).json({ savedNotes });
  } catch (error) {
    console.error("Error fetching saved notes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const markNoteForReview = async (req, res) => {
  const userId = req.user._id;
  const { documentId } = req.params;

  try {
    const noteUpdateResult = await NoteModel.updateOne(
      { _id: documentId, markedForReview: { $ne: true } },
      { $set: { markedForReview: true } }
    );

    if (noteUpdateResult.modifiedCount > 0) {
      await UserModel.updateOne(
        { _id: userId },
        { $inc: { reviewListCount: 1 } }
      );
      return res
        .status(200)
        .json({ message: "Note marked for review successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "Note already marked for review or not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const unmarkNoteForReview = async (req, res) => {
  const userId = req.user._id;
  const { documentId } = req.params;

  try {
    const noteUpdateResult = await NoteModel.updateOne(
      { _id: documentId, markedForReview: true },
      { $set: { markedForReview: false } }
    );

    if (noteUpdateResult.modifiedCount > 0) {
      await UserModel.updateOne(
        { _id: userId },
        { $inc: { reviewListCount: -1 } }
      );
      return res
        .status(200)
        .json({ message: "Note unmarked from review successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "Note not marked for review or not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
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
  saveNote,
  deleteSavedNote,
  getSavedNotes,
  markNoteForReview,
  unmarkNoteForReview,
};
