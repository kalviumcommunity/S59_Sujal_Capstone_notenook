import { Link } from "react-router-dom";
import { useState } from "react";
import formatDate from "../../Functions/FormatDate";

function MyNote({ note, handleDelete }) {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  return (
    <div className="myNote relative">
      {deleteConfirmation && (
        <div className="confirmation-popup">
          <p className="heading">Are you sure you want to delete this note?</p>
          <div className="flex gap-10">
            <button
              onClick={() => handleDelete(note._id)}
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
            <span className="lable">Title: </span>
            {note.title}
          </p>
          <p className="subject">
            <span className="lable">Subject: </span> {note.subject}
          </p>
        </div>
      </Link>
      <p className="updatedDate">Updated {formatDate(note.updatedAt)}</p>
      <div className="noteButtons">
        <Link to={`/notenook/postNotes/writeNote/${note._id}`}>
          <button className="update button">Update</button>
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

export default MyNote;
