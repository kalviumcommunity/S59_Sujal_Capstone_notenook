const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const markdownSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },

  title: { type: String, required: true },

  content: { type: String, required: true },
});

const noteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },

  subject: { type: String, required: true },

  fileReference: { type: String, required: true },

  markDownNote: markdownSchema,
});

const NoteModel = mongoose.model("Note", noteSchema);
module.exports = { NoteModel };
