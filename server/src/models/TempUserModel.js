const { boolean } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tempUserSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: { type: String, required: true, unique: true },
  oauthProvider: { type: String },
  oauthId: { type: String },
  isNewUser: { type: Boolean },
  createdAt: { type: Date, expires: 300, default: Date.now },
});

const TempUserModel = mongoose.model("TempUser", tempUserSchema);

module.exports = { TempUserModel };
