import { useState, useRef } from "react";
import { storage } from "../../firebase";
import { deleteObject } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

function PDFUploader({
  documentId,
  fileName,
  setFileName,
  fileUrl,
  setFileUrl,
}) {
  const [file, setFile] = useState(null);
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const fileInputRef = useRef(null);

  const handleRemoveFile = async () => {
    if (fileUrl) {
      const token = extractTokenFromCookie();
      if (!token) {
        return;
      }

      try {
        const storageRef = ref(storage, fileUrl);
        await deleteObject(storageRef);
        const res = await axios.delete(
          `${import.meta.env.VITE_REACT_APP_DELETE_PDF_ENDPOINT}/${documentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFileUrl("");

        alert("File removed successfully");
      } catch (error) {
        console.log(error);
        alert("Failed to remove file");
      }
    }

    setFileName("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      if (selectedFile.size > MAX_FILE_SIZE) {
        alert(
          "File size exceeds the maximum limit (10MB). Please upload a smaller file."
        );
        return;
      }
      setFileName(selectedFile.name);
      setFile(selectedFile);
    } else {
      alert("Please select a PDF file.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const uploadFile = async () => {
    if (!file) {
      return;
    }
    const token = extractTokenFromCookie();
    if (!token) {
      return;
    }
    try {
      const pdfRef = ref(storage, `pdfs/${file.name + uuidv4()}`);
      const response = await uploadBytes(pdfRef, file);
      const url = await getDownloadURL(response.ref);
      setFileUrl(url); 
      alert("Upload successful");

      const res = await axios.patch(
        import.meta.env.VITE_REACT_APP_UPDATE_PDF_ENDPOINT,
        {
          noteId: documentId,
          fileName: file.name,
          url: url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
      alert("Upload failed");
    }
  };

  return (
    <div className="pdfUploader self-center">
      <div className="flex w-full justify-around items-center mb-4">
        <div className="file-input-container">
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
            Upload Pdf
          </label>
        </div>
        <button className="button" onClick={uploadFile}>
          Update
        </button>
      </div>
      <div className="file-name-container" title={fileName || "No file chosen"}>
        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="file-name text-blue-600 block text-sm"
          >
            {fileName || "No file"}
          </a>
        ) : (
          <p className="file-name">{fileName || "No file"}</p>
        )}
        {fileName ? (
          <button
            type="button"
            className="ml-2 text-red-500 button delete mt-4"
            onClick={handleRemoveFile}
          >
            {fileUrl ? "Delete File" : "Remove file"}
          </button>
        ) : (
          "Uploaded"
        )}
      </div>
    </div>
  );
}

export default PDFUploader;
