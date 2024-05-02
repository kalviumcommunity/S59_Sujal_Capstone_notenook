import { useState, useRef } from "react";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

function PDFUploader({ documentId }) {
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState(""); // State to store the URL of the uploaded file
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleRemoveFile = () => {
    setFileName("");
    setFileUrl(""); // Clear file URL when removing the file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : "");
    setFile(file);
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
      console.log(url);
      setFileUrl(url); // Set file URL after successful upload
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
      console.log(res);
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
            className="ml-2 text-red-500 "
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
