import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import ViewWindow from "../../components/ViewNoteComponent/ViewWindow";
import PdfViewer from "../../components/ViewNoteComponent/PdfViewer";
import CommentsWindow from "../../components/ViewNoteComponent/CommentsWindow";
import formatDate from "../../Functions/FormatDate";
import "../../css/ViewNote.css";

function ViewNote() {
  const { documentId } = useParams();

  const [note, setNote] = useState({});
  const [isPdfVisible, setIsPdfVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);

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
        const { note, isOwner, isSaved } = response.data;
        setNote(note);
        setIsOwner(isOwner);
        setIsSaved(isSaved);
      } catch (error) {
        console.error("Error fetching default values:", error);
      }
    };

    fetchDefaultValues();
  }, [documentId]);

  const { fileReference } = note;

  const togglePdfVisibility = () => {
    setIsPdfVisible(!isPdfVisible);
    if (!isPdfVisible) {
      setIsCommentsVisible(false);
    }
    setHasInteracted(true);
  };

  const toggleCommentsVisibility = () => {
    setIsCommentsVisible(!isCommentsVisible);
    if (!isCommentsVisible) {
      setIsPdfVisible(false);
    }
    setHasInteracted(true);
  };

  const saveNote = async () => {
    try {
      const token = extractTokenFromCookie();
      if (!token || !documentId) return;

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_SAVE_NOTE_ENDPOINT}/${documentId}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const unsaveNote = async () => {
    try {
      const token = extractTokenFromCookie();
      if (!token || !documentId) return;

      const response = await axios.delete(
        `${
          import.meta.env.VITE_REACT_APP_DELETE_SAVE_NOTE_ENDPOINT
        }/${documentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setIsSaved(false);
      }
    } catch (error) {
      console.error("Error unsaving note:", error);
    }
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
          <div className="w-full flex gap-10 justify-end">
            {!isOwner && !isSaved && (
              <button className="button saveNote" onClick={saveNote}>
                Save Note
              </button>
            )}
            {!isOwner && isSaved && (
              <button className="button unsaveNote" onClick={unsaveNote}>
                Unsave Note
              </button>
            )}
            {note?.fileReference && (
              <button className="button viewPdf" onClick={togglePdfVisibility}>
                {isPdfVisible ? "Hide Pdf" : "View Pdf"}
              </button>
            )}
            <button
              className="button viewComments"
              onClick={toggleCommentsVisibility}
            >
              {isCommentsVisible ? "Hide Comments" : "View Comments"}
            </button>
          </div>
        </div>

        <ViewWindow note={note} />
      </div>

      {hasInteracted && (
        <div
          className={`pdfContainer ${isPdfVisible ? "visible" : "invisible"}`}
        >
          <PdfViewer fileReference={fileReference} />
        </div>
      )}

      {hasInteracted && (
        <div
          className={`commentsContainer ${
            isCommentsVisible ? "visible" : "invisible"
          }`}
        >
          <CommentsWindow />
        </div>
      )}

      {isPdfVisible && (
        <div className="backdrop" onClick={togglePdfVisibility}>
          <button className="button" aria-label="Close PDF Viewer">
            Close PDF Viewer
          </button>
        </div>
      )}

      {isCommentsVisible && (
        <div className="backdrop" onClick={toggleCommentsVisibility}>
          <button className="button" aria-label="Close Comments Window">
            Close Comments Window
          </button>
        </div>
      )}
    </div>
  );
}

export default ViewNote;
