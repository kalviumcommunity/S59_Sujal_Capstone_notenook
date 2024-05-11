const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, minlength: 3 },
    subject: { type: String, required: true, minlength: 3 },
    fileReference: {
      fileName: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    postedNote: { type: Schema.Types.ObjectId, ref: "PostedNote" },
    document: Object,
  },
  { timestamps: true }
);

noteSchema.index({ updatedAt: -1 });
const NoteModel = mongoose.model("Note", noteSchema);

module.exports = { NoteModel };
