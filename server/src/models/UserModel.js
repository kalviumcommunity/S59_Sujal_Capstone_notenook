const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },

  fullname: {
    type: String,
    required: true,
  },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],

  notes: [{ type: Schema.Types.ObjectId, ref: "Note" }],

  chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
});

UserSchema.index({ username: 1, email: 1 });

const UserModel = new mongoose.model("User", UserSchema);

module.exports = { UserModel };
