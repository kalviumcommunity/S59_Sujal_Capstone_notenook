import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Quill from "quill";
import "quill/dist/quill.snow.css";

import ToolBar from "./ToolBar";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

import "../../css/TextEditor.css";

function TextEditor() {
  const { documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const [loadingError, setLoadingError] = useState(null);
  const [savingError, setSavingError] = useState(null);

  useEffect(() => {
    const token = extractTokenFromCookie();
    if (!token) {
      return;
    }
    const socketConnection = io(
      import.meta.env.VITE_REACT_APP_TEXT_EDITOR_SOCKET,
      { auth: { token } }
    );

    setSocket(socketConnection);
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) {
      return;
    }
    const handler = (delta, oldDelta, source) => {
      if (source !== "user") {
        return;
      }
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) {
      return;
    }

    socket.emit("get-document", documentId);

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.on("authorization-error", (error) => {
      setLoadingError(error);
    });

    socket.on("document-fetch-error", (errorMessage) => {
      setLoadingError(errorMessage);
    });

    socket.on("document-save-error", (errorMessage) => {
      setSavingError(errorMessage);
    });

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill, documentId]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");

    wrapper.append(editor);
    const q = new Quill(editor, {
      modules: {
        toolbar: { container: "#toolbar" },
      },
      theme: "snow",
    });
    q.disable();
    q.setText("Loading document......");
    setQuill(q);
  }, []);

  return (
    <div className="relative textEditor">
      {loadingError && <div>Error loading document: {loadingError}</div>}
      {savingError && <div>Error saving document: {savingError}</div>}
      <ToolBar />
      <div id="textEditorContainer" ref={wrapperRef}>
        <div id="editor"></div>
      </div>
    </div>
  );
}

export default TextEditor;
