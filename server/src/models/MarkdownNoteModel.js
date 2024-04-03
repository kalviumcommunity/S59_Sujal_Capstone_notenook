const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const markdownSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },

  title: { type: String, required: true },

  content: { type: String, required: true },
});

const MarkdownModel = new mongoose.model("Markdown", markdownSchema);

module.exports = { MarkdownModel };
