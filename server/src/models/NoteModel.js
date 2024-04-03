const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },

  subject: { type: String, required: true },

  fileReference: { type: URL, required: true },
});

const NoteModel = new mongoose.model("Note", noteSchema);
module.exports = { NoteModel };
