import { useContext } from "react";

import { NotesContext } from "../../context/notesContext";

import SavedNote from "./SavedNote";

function SavedList() {
  const {
    savedNotes,
    handleDeleteSavedNote,
    handleMarkSavedNoteForReview,
    handleUnmarkSavedNoteForReview,
  } = useContext(NotesContext);

  return (
    <div>
      <div className="myNotes savedNotesList">
        {savedNotes.map((note) => (
          <SavedNote
            key={note.savedNote._id}
            savedNote={note.savedNote}
            originalNoteId={note.originalNote} 
            handleDelete={handleDeleteSavedNote}
            handleMarkForReview={handleMarkSavedNoteForReview}
            handleUnmarkForReview={handleUnmarkSavedNoteForReview}
          />
        ))}
      </div>
    </div>
  );
}

export default SavedList;
