import { useState } from "react";
import { Link } from "react-router-dom";

import formatDate from "../../Functions/FormatDate";

import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CircularProgress from "@mui/material/CircularProgress";

function SavedNote({
  savedNote,
  originalNoteId,
  handleDelete,
  handleMarkForReview,
  handleUnmarkForReview,
}) {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMark = async () => {
    setLoading(true);
    await handleMarkForReview(savedNote._id);
    setLoading(false);
  };

  const handleUnmark = async () => {
    setLoading(true);
    await handleUnmarkForReview(savedNote._id);
    setLoading(false);
  };

  return (
    <div className="savedNote myNote relative">
      {deleteConfirmation && (
        <div className="confirmation-popup">
          <p className="heading">
            Are you sure you want to delete this saved note?
          </p>

          <div className="flex gap-10">
            <button
              onClick={() => handleDelete(savedNote._id)}
              className="button yes-button"
            >
              Yes
            </button>

            <button
              onClick={() => setDeleteConfirmation(false)}
              className="button cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Link to={`/notenook/viewNote/${savedNote._id}`}>
        <div className="noteInfo">
          <p className="title">
            <span className="label">Title: </span>
            {savedNote.title}
          </p>

          <p className="subject">
            <span className="label">Subject: </span>
            {savedNote.subject}
          </p>
        </div>
      </Link>

      <p className="updatedDate">Saved {formatDate(savedNote.createdAt)}</p>
      <div className="noteButtons">
        {loading ? (
          <CircularProgress size={24} />
        ) : savedNote.markedForReview ? (
          <BookmarkIcon className="goldenBookmark" onClick={handleUnmark} />
        ) : (
          <BookmarkAddIcon className="addBookmark" onClick={handleMark} />
        )}

        <Link to={`/notenook/viewNote/${savedNote._id}`}>
          <button className="view button">View</button>
        </Link>

        <Link to={`/notenook/viewNote/${originalNoteId}`}>
          <button className="viewOriginal button">Original Note</button>
        </Link>

        <button
          onClick={() => setDeleteConfirmation(true)}
          className="delete button"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default SavedNote;
