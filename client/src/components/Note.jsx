import formatDate from "../Functions/FormatDate";

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
        <button className="view button">View</button>
      </div>
    </div>
  );
}

export default Note;
