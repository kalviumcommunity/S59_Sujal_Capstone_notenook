import formatDate from "../Functions/FormatDate";
import { Link } from "react-router-dom";

function Note({ note }) {
  return (
    <div className="note">
      <p className="title">
        <span className="lable">Title: </span>
        {note.title}
      </p>
      <p className="subject">
        <span className="lable">Subject: </span>
        {note.subject}
      </p>
      <p className="updatedDate">Posted {formatDate(note.updatedAt)}</p>
      <div className="noteButtons">
        <Link to={`/notenook/viewNote/${note._id}`}>
          <button className="view button">View</button>
        </Link>
      </div>
    </div>
  );
}

export default Note;
