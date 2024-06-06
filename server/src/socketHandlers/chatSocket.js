const jwt = require("jsonwebtoken");

let chatNamespace = null;
const userSocketMap = {};

function chatSocket(ioNamespace) {
  chatNamespace = ioNamespace;

  chatNamespace.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error"));
      }
      socket.userId = decoded.userId;
      next();
    });
  });

  chatNamespace.on("connection", (socket) => {
    console.log("New client connected to chat namespace");

    userSocketMap[socket.userId] = socket.id;

    socket.emit("connectionSuccess", {
      message: "You have successfully connected to the chat server.",
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from chat namespace");

      delete userSocketMap[socket.userId];
    });
  });
}

module.exports = {
  chatSocket,
  getChatNamespace: () => chatNamespace,
  userSocketMap,
};
