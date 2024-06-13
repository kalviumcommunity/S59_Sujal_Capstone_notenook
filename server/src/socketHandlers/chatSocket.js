const jwt = require("jsonwebtoken");
const { redisClient } = require("../config/redisConfig");

let chatNamespace = null;

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
    redisClient.set(socket.userId, socket.id);

    socket.emit("connectionSuccess", {
      message: "You have successfully connected to the chat server.",
    });

    socket.on("disconnect", () => {
      redisClient.del(socket.userId);
    });
  });
}

async function getUserSocketId(userId) {
  try {
    const socketId = await redisClient.get(userId);
    return socketId;
  } catch (err) {
    console.error("Error retrieving socket ID from Redis:", err);
    return null;
  }
}

module.exports = {
  chatSocket,
  getChatNamespace: () => chatNamespace,
  getUserSocketId,
};
