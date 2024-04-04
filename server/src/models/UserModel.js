const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },

  fullname: {
    type: String,
    required: true,
  },

  email: { type: String, required: true, unique: true },

  password: { type: String },

  oauthProvider: { type: String },

  oauthId: { type: String },

  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],

  notes: [{ type: Schema.Types.ObjectId, ref: "Note" }],

  chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
});

UserSchema.index({ username: 1, email: 1 });

UserSchema.methods.setPassword = function (password) {
  this.password = crypto.createHash("sha512").update(password).digest("hex");
};

UserSchema.methods.validatePassword = function (password) {
  const hash = crypto.createHash("sha512").update(password).digest("hex");
  return this.password === hash;
};

const UserModel = new mongoose.model("User", UserSchema);

module.exports = { UserModel };
