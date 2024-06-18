import { useContext } from "react";

import { NotesContext } from "../../context/notesContext";

import MyNote from "./MyNote";

import "../../css/NoteList.css";

function MyNoteList() {
  const {
    notes,
    handleDeleteNote,
    handleMarkForReview,
    handleUnmarkForReview,
  } = useContext(NotesContext);

  return (
    <div className="myNoteList">
      <div className="myNotes">
        {notes.map((note) => (
          <MyNote
            key={note._id}
            note={note}
            handleDelete={handleDeleteNote}
            handleMarkForReview={handleMarkForReview}
            handleUnmarkForReview={handleUnmarkForReview}
          />
        ))}
      </div>
    </div>
  );
}

export default MyNoteList;
