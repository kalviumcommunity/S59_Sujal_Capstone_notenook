const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    fileReference: { type: String },
    document: Object,
  },
  { timestamps: true }
);

const NoteModel = mongoose.model("Note", noteSchema);

module.exports = { NoteModel };
