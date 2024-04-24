const { NoteModel } = require("../models/NoteModel");

function textEditorSocket(io) {
  io.on("connection", (socket) => {
    console.log("connected to text-editor socket...");

    socket.on("send-changes", (delta) => {
      console.log(delta);
    });

    socket.on("get-document", async (documentId) => {
      try {
        const note = await NoteModel.findById(documentId);
        if (!note) {
          socket.emit("document-not-found", "Document not found");
          return;
        }
        socket.emit("load-document", note.document);
      } catch (error) {
        console.error("Error fetching document:", error.message);
        socket.emit("document-fetch-error", "Error fetching document");
      }

      socket.on("save-document", async (data) => {
        try {
          const updatedNote = await NoteModel.findByIdAndUpdate(documentId, {
            document: data,
          });
          console.log(updatedNote);
        } catch (error) {
          console.error("Error saving document:", error.message);
          socket.emit("document-save-error", "Error saving document");
        }
      });
    });
  });
}

module.exports = { textEditorSocket };
