import formatDate from "../../Functions/FormatDate";
import { Link } from "react-router-dom";
import "../../css/NoteList.css";
import Note from "../Note";

function PostedNotesList({ postedNotes, isMyProfile }) {
  let Post;
  if (!isMyProfile) {
    Post = Note;
  } else {
    Post = PostedNote;
  }
  return (
    <div className="myNoteList">
      <div className="myNotes">
        {postedNotes &&
          postedNotes.map((note) => <Post key={note._id} note={note} />)}
      </div>
    </div>
  );
}

function PostedNote({ note }) {
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
        <Link to={`/notenook/myNotes/writeNote/${note.note}`}>
          <button className="viewOriginal button">Original Note</button>
        </Link>
      </div>
    </div>
  );
}

export default PostedNotesList;
