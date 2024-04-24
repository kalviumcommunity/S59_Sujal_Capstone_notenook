const { NoteModel } = require("../models/NoteModel");

function textEditorSocket(io) {
  io.on("connection", (socket) => {
    console.log("connected to text-editor socket...");

    socket.on("send-changes", (delta) => {
      console.log(delta);
    });

    socket.on("get-document", async (documentId) => {
      const note = await NoteModel.findById(documentId);

      socket.emit("load-document", note.document);

      socket.on("save-document", async (data) => {
        const updatedNote = await NoteModel.findByIdAndUpdate(documentId, {
          document: data,
        });
        console.log(updatedNote);
      });
    });
  });
}

module.exports = { textEditorSocket };
