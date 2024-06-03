const express = require("express");

const { ChatModel } = require("../models/ChatModel");
const { MessageModel } = require("../models/MessageModel");
const { UserModel } = require("../models/UserModel");

const router = express.Router();
const { authenticateJWT } = require("../auth/authenticateJWT");

router.get("/getUsersForChat", authenticateJWT, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).populate({
      path: "chats",
      populate: {
        path: "participants",
        select: "username",
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const participants = user.chats.reduce((acc, chat) => {
      chat.participants.forEach((participant) => {
        if (participant._id.toString() !== req.user._id.toString()) {
          acc.add(
            JSON.stringify({
              id: participant._id.toString(),
              username: participant.username,
            })
          );
        }
      });
      return acc;
    }, new Set());

    const filteredUsers = Array.from(participants).map((participant) =>
      JSON.parse(participant)
    );

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForChat: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/send/:receiverId", authenticateJWT, async (req, res) => {
  try {
    const { message } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user._id;

    let chat = await ChatModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = new ChatModel({
        participants: [senderId, receiverId],
      });
      await chat.save();
      await UserModel.findByIdAndUpdate(req.user._id, {
        $push: { chats: chat._id },
      });
    }

    const newMessage = new MessageModel({
      senderId,
      receiverId,
      chatId: chat._id,
      message: message,
      timestamp: new Date(),
    });

    await newMessage.save();

    await ChatModel.findByIdAndUpdate(chat._id, {
      $push: { messages: newMessage._id },
    });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/messages/:userToChatId", authenticateJWT, async (req, res) => {
  try {
    const { userToChatId } = req.params;
    const senderId = req.user._id;

    const chat = await ChatModel.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!chat) return res.status(200).json([]);

    const messages = chat.messages;

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
