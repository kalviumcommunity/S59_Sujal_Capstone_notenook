import React from "react";
import { Link } from "react-router-dom";
import formatDate from "../Functions/FormatDate";
function MyNote({ note }) {
  return (
    <div className="myNote">
      <Link to={`writeNote/${note.noteId}`}>
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
      <p className="updatedDate">Updated {formatDate(note.updatedOn)}</p>
      <div className="noteButtons">
        <button className="update button">Update</button>
        <button className="delete button">Delete</button>
      </div>
    </div>
  );
}

export default MyNote;
