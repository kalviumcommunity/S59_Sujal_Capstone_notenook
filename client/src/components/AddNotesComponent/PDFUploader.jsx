import React, { useState, useRef } from "react";

function PDFUploader() {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleRemoveFile = () => {
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : "");
  };

  return (
    <div className="pdfUploader self-center">
      <div className="grid">
        <div className="file-input-container justify-self-center mb-4">
          <input
            ref={fileInputRef}
            type="file"
            id="fileInput"
            className="file-input"
            aria-describedby="fileInputLabel"
            accept=".pdf"
            multiple={false}
            onChange={handleFileChange}
          />

          <label
            htmlFor="fileInput"
            className="file-input-label button"
            role="button"
            id="fileInputLabel"
          >
            Update Pdf
          </label>
        </div>
      </div>
      <div className="file-name-container" title={fileName || "No file chosen"}>
        <p className="file-name">{fileName || "No file"}</p>
        {fileName ? (
          <button
            type="button"
            className="ml-2 text-red-500"
            onClick={handleRemoveFile}
          >
            Delete File
          </button>
        ) : (
          "Uploaded"
        )}
      </div>
    </div>
  );
}

export default PDFUploader;
