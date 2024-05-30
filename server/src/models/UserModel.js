const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const argon2 = require("argon2");

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

  postedNotes: [{ type: Schema.Types.ObjectId, ref: "PostedNote" }],

  chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],

  friendRequests: [{ type: Schema.Types.ObjectId, ref: "FriendRequest" }],

  notificationList: { type: Schema.Types.ObjectId, ref: "NotificationList" },
});

UserSchema.index({ username: 1, email: 1 });

UserSchema.index({ friends: 1 });
UserSchema.index({ notes: 1 });
UserSchema.index({ postedNotes: 1 });

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
