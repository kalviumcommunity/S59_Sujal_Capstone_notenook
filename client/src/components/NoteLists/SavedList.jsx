import { useContext, useState, useEffect } from "react";
import { NotesContext } from "../../context/notesContext";
import SavedNote from "../NoteCards/SavedNote";
import DeleteAlert from "../MyNotesPageComponents/DeleteAlert";
import ErrorAlert from "../MyNotesPageComponents/ErrorAlert";

function SavedList() {
  const {
    savedNotes,
    error,
    setError,
    handleDeleteSavedNote,
    handleMarkSavedNoteForReview,
    handleUnmarkSavedNoteForReview,
  } = useContext(NotesContext);

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  const [showError, setShowError] = useState(false);

  const confirmDelete = (noteId) => {
    setDeleteNoteId(noteId);
    setDeleteConfirmation(true);
  };

  const handleDelete = async () => {
    try {
      await handleDeleteSavedNote(deleteNoteId);
    } catch (err) {
      setShowError(true);
    }
    setDeleteConfirmation(false);
    setDeleteNoteId(null);
  };

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 justify-center pr-2">
      <DeleteAlert
        deleteConfirmation={deleteConfirmation}
        setDeleteConfirmation={setDeleteConfirmation}
        handleDelete={handleDelete}
      />
      <ErrorAlert
        error={error}
        setError={setError}
        showError={showError}
        setShowError={setShowError}
      />
      {savedNotes.map((note) => (
        <SavedNote
          key={note.savedNote._id}
          savedNote={note.savedNote}
          originalNoteId={note.originalNote}
          confirmDelete={confirmDelete}
          handleMarkForReview={handleMarkSavedNoteForReview}
          handleUnmarkForReview={handleUnmarkSavedNoteForReview}
        />
      ))}
    </div>
  );
}

export default SavedList;
