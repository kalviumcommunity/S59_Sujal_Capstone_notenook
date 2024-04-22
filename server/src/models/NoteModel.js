const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, minlength: 3 },
    subject: { type: String, required: true, minlength: 3 },
    fileReference: { type: String },
    document: Object,
  },
  { timestamps: true }
);

const NoteModel = mongoose.model("Note", noteSchema);

module.exports = { NoteModel };
