import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Route, Routes, Link } from "react-router-dom";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

import ViewWindow from "../../components/ViewNoteComponent/ViewWindow";
import PdfViewer from "../../components/ViewNoteComponent/PdfViewer";

import formatDate from "../../Functions/FormatDate";
import "../../css/ViewNote.css";

import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function ViewNote() {
  const { documentId } = useParams();

  const [note, setNote] = useState({});
  const [isPdfVisible, setIsPdfVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const fetchDefaultValues = async () => {
      try {
        const token = extractTokenFromCookie();
        if (!token || !documentId) return;

        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_VIEW_NOTE_ENDPOINT
          }?documentId=${documentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { note } = response.data;
        setNote(note);
        console.log(note);
      } catch (error) {
        console.error("Error fetching default values:", error);
      }
    };

    fetchDefaultValues();
  }, [documentId]);

  const { fileReference } = note;

  const togglePdfVisibility = () => {
    setIsPdfVisible(!isPdfVisible);
    setHasInteracted(true);
  };

  return (
    <div className={`viewNotePage`}>
      <div className={`viewWindowContainer ${isPdfVisible ? "withPdf" : ""}`}>
        <div className="noteViewDetails">
          <h1 className="title">
            <span className="label labelTitle">Title:</span>{" "}
            <span className="content">{note.title || "...."}</span>
          </h1>
          <h2 className="subject">
            <span className="label labelSubject">Subject:</span>{" "}
            <span className="content">{note.subject || "...."}</span>
          </h2>
          <div className="postedInfo">
            <p className="postedBy">
              <span className="label labelPostedBy">Posted By:</span>{" "}
              <span className="content">
                {note.postedBy?.username || "...."}
              </span>
            </p>
            <p className="postedAt">
              <span className="label labelPostedAt">Posted:</span>{" "}
              <span className="content">
                {(note && formatDate(note.updatedAt)) || "...."}
              </span>
            </p>
          </div>
        </div>
        {note?.fileReference && (
          <button className="button viewPdf" onClick={togglePdfVisibility}>
            {isPdfVisible ? "Hide Pdf" : "View Pdf"}
          </button>
        )}

        <ViewWindow note={note} />
      </div>

      {hasInteracted && (
        <div
          className={`pdfContainer ${isPdfVisible ? "visible" : "invisible"}`}
        >
          <PdfViewer fileReference={fileReference} />
        </div>
      )}
      
      {isPdfVisible && (
        <div className="backdrop" onClick={togglePdfVisibility}>
          <button className="button">X</button>
        </div>
      )}
    </div>
  );
}

export default ViewNote;
