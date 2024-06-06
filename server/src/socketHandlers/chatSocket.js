const jwt = require("jsonwebtoken");

let chatNamespace = null;
const userSocketMap = {};

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
