import React from "react";
import { Link } from "react-router-dom";
function MyNote({ note }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="note">
      <Link to={`/${note._id}`}>
        <div className="noteInfo">
          <p className="subject">
            <span className="subjectLable">Subject: </span> {note.subject}
          </p>
          <p className="title">
            <span className="titleLable">Title: </span>
            {note.title}
          </p>
        </div>
      </Link>
      <p className="postedBy">{note.user?.username}</p>
      <p className="uploadDate">Updated At: {formatDate(note.updatedAt)}</p>
      <div className="noteButtons">
        <button className="update button">Update</button>
        <button className="delete button">Delete</button>
      </div>
    </div>
  );
}

export default MyNote;
