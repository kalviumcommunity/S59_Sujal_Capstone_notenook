import { useContext } from "react";
import { NotesContext } from "../context/notesContext";
import Note from "./Note";
import "../css/NoteList.css";

function NoteList() {
  const { notes } = useContext(NotesContext);

  return (
    <div className="noteList relative">
      {!notes.length && <p className="placeHolder">Your Notes Appear here</p>}
      <h1 className="heading">My Notes</h1>
      <div className="notesDisplay">
        {notes.length !== 0 &&
          notes.map((note) => <Note note={note} key={note._id} />)}
      </div>
    </div>
  );
}

export default NoteList;
