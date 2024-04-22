function textEditorSocket(io) {
  io.on("connection", (socket) => {
    socket.on("text_editor_event", (data) => {
      console.log(data);
    });
  });
}

module.exports = { textEditorSocket };
