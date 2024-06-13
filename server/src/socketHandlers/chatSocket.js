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

  chatNamespace.on("connection", async (socket) => {
    await setSocketUserId(socket.userId, socket.id);

    socket.emit("connectionSuccess", {
      message: "You have successfully connected to the chat server.",
    });

    socket.on("disconnect", async () => {
      await deleteSocketUserId(socket.userId);
    });
  });
}

async function setSocketUserId(userId, socketId) {
  try {
    await redisClient.set(userId, socketId);
  } catch (error) {
    console.error("Error setting Redis key:", error);
    throw new Error("Failed to set Redis key");
  }
}

async function deleteSocketUserId(userId) {
  try {
    await redisClient.del(userId);
  } catch (error) {
    console.error("Error deleting Redis key:", error);
    throw new Error("Failed to delete Redis key");
  }
}

async function getUserSocketId(userId) {
  try {
    const socketId = await redisClient.get(userId);
    return socketId;
  } catch (err) {
    console.error("Error retrieving socket ID from Redis:", err);
    throw new Error("Failed to retrieve socket ID from Redis");
  }
}

module.exports = {
  chatSocket,
  getChatNamespace: () => chatNamespace,
  getUserSocketId,
};
