import React, { useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

function TextEditor() {
  const wrapperRef = useCallback((wrapper) => {
    console.log(wrapper);
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");

    wrapper.append(editor);
    const toolbarOptions = [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      ["link"],

      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],

      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],

      ["clean"],
    ];
    new Quill(editor, {
      modules: {
        toolbar: toolbarOptions,
      },
      placeholder: "Compose an epic...",
      theme: "snow",
    });
  }, []);

  return (
    <>
      <div id="container" ref={wrapperRef}>
        Text Editor lorem100
      </div>
    </>
  );
}

export default TextEditor;