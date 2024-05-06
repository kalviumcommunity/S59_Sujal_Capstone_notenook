import { Link } from "react-router-dom";

import formatDate from "../../Functions/FormatDate";

function MyNote({ note }) {
  return (
    <div className="myNote">
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
        <Link to={`writeNote/${note._id}`}>
          <button className="update button">Update</button>
        </Link>
        <button className="delete button">Delete</button>
      </div>
    </div>
  );
}

export default MyNote;
