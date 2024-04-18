import React, { useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import ToolBar from "./ToolBar";
import "../css/TextEditor.css";
function TextEditor() {
  const wrapperRef = useCallback((wrapper) => {
    console.log(wrapper);
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");

    wrapper.append(editor);
    new Quill(editor, {
      modules: {
        toolbar: { container: "#toolbar" },
      },
      theme: "snow",
    });
  }, []);

  return (
    <div className="relative textEditor">
      <ToolBar />
      <div id="textEditorContainer" ref={wrapperRef}>
        <div id="editor"></div>
      </div>
    </div>
  );
}

export default TextEditor;
