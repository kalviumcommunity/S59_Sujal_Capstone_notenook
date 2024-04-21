const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const argon2 = require("argon2");

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  oauthProvider: { type: String },
  oauthId: { type: String },
  friends: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      friendName: { type: String, required: true },
    },
  ],
  notes: [
    {
      noteId: { type: Schema.Types.ObjectId, ref: "Note", required: true },
      title: { type: String, required: true },
      subject: { type: String, required: true },
    },
  ],
  chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
});

UserSchema.index({ username: 1, email: 1 });

UserSchema.methods.setPassword = async function (password) {
  try {
    this.password = await argon2.hash(password);
    console.log(this);
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

UserSchema.methods.validatePassword = async function (password) {
  try {
    return await argon2.verify(this.password, password);
  } catch (error) {
    return false;
  }
};

const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel };
