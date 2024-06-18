import { useState } from "react";
import { Link } from "react-router-dom";

import formatDate from "../../Functions/FormatDate";

import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CircularProgress from "@mui/material/CircularProgress";

function MyReviewNote({ note, handleMarkForReview, handleUnmarkForReview }) {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMark = async () => {
    setLoading(true);
    await handleMarkForReview(note._id);
    setLoading(false);
  };

  const handleUnmark = async () => {
    setLoading(true);
    await handleUnmarkForReview(note._id);
    setLoading(false);
  };

  return (
    <div className="myNote relative">
      {deleteConfirmation && (
        <div className="confirmation-popup">
          <p className="heading">Are you sure you want to delete this note?</p>
          <div className="flex gap-10">
            <button
              onClick={() => {
                handleDelete(note._id);
              }}
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

      <Link to={`/notenook/viewNote/${note._id}`}>
        <div className="noteInfo">
          <p className="title">
            <span className="label">Title: </span>
            {note.title}
          </p>

          <p className="subject">
            <span className="label">Subject: </span> {note.subject}
          </p>
        </div>
      </Link>

      <p className="updatedDate">Updated {formatDate(note.updatedAt)}</p>
      <div className="noteButtons">
        {loading ? (
          <CircularProgress size={24} />
        ) : note.markedForReview ? (
          <BookmarkIcon className="goldenBookmark" onClick={handleUnmark} />
        ) : (
          <BookmarkAddIcon className="addBookmark" onClick={handleMark} />
        )}

        <Link to={`/notenook/postNotes/writeNote/${note._id}`}>
          <button className="update button">Update</button>
        </Link>
        <Link to={`/notenook/viewNote/${note._id}`}>
          <button className="view button">View</button>
        </Link>
      </div>
    </div>
  );
}

export default MyReviewNote;
