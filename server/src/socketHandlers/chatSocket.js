function chatSocket(io) {
  io.on("connection", (socket) => {
    socket.on("chat_message", (message) => {
      console.log(message);
    });
  });
}

module.exports = { chatSocket };
