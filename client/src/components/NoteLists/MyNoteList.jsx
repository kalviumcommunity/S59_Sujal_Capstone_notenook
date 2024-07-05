import { useContext, useState, useEffect } from "react";
import { NotesContext } from "../../context/notesContext";
import MyNote from "../NoteCards/MyNote";
import DeleteAlert from "../MyNotesPageComponents/DeleteAlert";
import ErrorAlert from "../MyNotesPageComponents/ErrorAlert";

function MyNoteList() {
  const {
    notes,
    error,
    setError,
    handleDeleteNote,
    handleMarkForReview,
    handleUnmarkForReview,
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
      await handleDeleteNote(deleteNoteId);
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
      {notes.map((note) => (
        <MyNote
          key={note._id}
          note={note}
          confirmDelete={confirmDelete}
          handleMarkForReview={handleMarkForReview}
          handleUnmarkForReview={handleUnmarkForReview}
        />
      ))}
    </div>
  );
}

export default MyNoteList;
