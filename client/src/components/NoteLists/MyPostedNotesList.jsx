import Note from "../Note";
import MyPostedNote from "../NoteCards/MyPostedNote";
function MyPostedNotesList({ postedNotes, isMyProfile }) {
  if (!isMyProfile) {
    Post = Note;
  } else {
    Post = PostedNote;
  }
  return (
    <div className="myNoteList">
      <div className="myNotes">
        {postedNotes &&
          postedNotes.map((note) => (
            <MyPostedNote key={note._id} note={note} />
          ))}
      </div>
    </div>
  );
}

export default MyPostedNotesList;
