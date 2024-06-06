const { NoteModel } = require("../models/NoteModel");
const jwt = require("jsonwebtoken");

function textEditorSocket(io) {
  io.use((socket, next) => {
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
