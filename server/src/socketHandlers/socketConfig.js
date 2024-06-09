const socketIO = require("socket.io");

const initializeSocketIO = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URI,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
  });

  return io;
};

module.exports = { initializeSocketIO };
