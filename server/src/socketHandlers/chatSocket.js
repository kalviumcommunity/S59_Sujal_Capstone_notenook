const {
  authenticateSocketHandshake,
} = require("../middlewares/socketHandshakeAuthentication");
const { redisClient } = require("../config/redisConfig");

let chatNamespace = null;

function chatSocket(ioNamespace) {
  chatNamespace = ioNamespace;

  chatNamespace.use(authenticateSocketHandshake);

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
