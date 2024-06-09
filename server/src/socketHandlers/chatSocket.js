const jwt = require("jsonwebtoken");
const { ChatModel } = require("../models/ChatModel");
const { MessageModel } = require("../models/MessageModel");
const { UserModel } = require("../models/UserModel");

let chatNamespace = null;
const userSocketMap = {};

async function handleSendMessage(socket, data, chatNamespace) {
  try {
    const { receiverId, message } = data;
    const senderId = socket.userId;

    let chat = await ChatModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = new ChatModel({
        participants: [senderId, receiverId],
      });
      await chat.save();
      await UserModel.findByIdAndUpdate(senderId, {
        $push: { chats: chat._id },
      });
      await UserModel.findByIdAndUpdate(receiverId, {
        $push: { chats: chat._id },
      });

      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        chatNamespace.to(receiverSocketId).emit("newChatCreated", {
          chatId: chat._id,
          senderId,
          senderUsername: socket.username,
        });
      }
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

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      chatNamespace.to(receiverSocketId).emit("receiveMessage", newMessage);
    }

    socket.emit("messageSent", newMessage);
  } catch (err) {
    console.error(err);
    socket.emit("error", "Server error");
  }
}

function chatSocket(ioNamespace) {
  chatNamespace = ioNamespace;

  chatNamespace.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: Token not provided"));
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        let errorMessage = "Authentication error";
        if (err.name === "TokenExpiredError") {
          errorMessage = "Authentication error: Token has expired";
        } else if (err.name === "JsonWebTokenError") {
          errorMessage = "Authentication error: Invalid token";
        }
        return next(new Error(errorMessage));
      }

      if (!decoded.userId) {
        return next(new Error("Authentication error: Invalid token payload"));
      }

      socket.userId = decoded.userId;
      socket.username = decoded.username;
      next();
    });
  });

  chatNamespace.on("connection", (socket) => {
    userSocketMap[socket.userId] = socket.id;

    socket.emit("connectionSuccess", {
      message: "You have successfully connected to the chat server.",
    });

    socket.on("sendMessage", (data) => {
      handleSendMessage(socket, data, chatNamespace);
    });

    socket.on("disconnect", () => {
      delete userSocketMap[socket.userId];
    });
  });
}

module.exports = {
  chatSocket,
  getChatNamespace: () => chatNamespace,
  userSocketMap,
};
