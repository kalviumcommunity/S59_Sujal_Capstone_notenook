import { createContext, useEffect, useState } from "react";
import axios from "axios";
import extractTokenFromCookie from "../Functions/ExtractTokenFromCookie";

const NotesContext = createContext();

function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [savedNotes, setSavedNotes] = useState([]);
  const [postedNotes, setPostedNotes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotes = async (token) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_GET_NOTE_ENDPOINT}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setNotes(response.data.notes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError("Failed to fetch notes. Please try again.");
        setLoading(false);
      }
    };

    const fetchSavedNotes = async (token) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_GET_SAVED_NOTE_ENDPOINT}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSavedNotes(response.data.savedNotes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching saved notes:", error);
        setError("Failed to fetch saved notes. Please try again.");
        setLoading(false);
      }
    };

    const fetchPostedNotes = async (token) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_GET_POSTED_NOTES_ENDPOINT}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setPostedNotes(response.data.postedNotes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError("Failed to fetch posted notes. Please try again.");
        setLoading(false);
      }
    };

    const token = extractTokenFromCookie();
    if (token) {
      fetchNotes(token);
      fetchSavedNotes(token);
      fetchPostedNotes(token);
    }
  }, []);

  const handleDeleteNote = async (noteId) => {
    try {
      const token = extractTokenFromCookie();
      if (!token) return;

      await axios.delete(
        `${import.meta.env.VITE_REACT_APP_DELETE_NOTE_ENDPOINT}/${noteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Failed to delete note. Please try again.");
    }
  };

  const handleDeleteSavedNote = async (noteId) => {
    try {
      const token = extractTokenFromCookie();
      if (!token) return;

      await axios.delete(
        `${
          import.meta.env.VITE_REACT_APP_DELETE_SAVED_NOTE_ENDPOINT
        }/${noteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSavedNotes(savedNotes.filter((note) => note.savedNote._id !== noteId));
    } catch (error) {
      console.error("Error deleting saved note:", error);
      setError("Failed to delete saved note. Please try again.");
    }
  };

  const handleDeletePostedNote = async (noteId) => {
    try {
      const token = extractTokenFromCookie();
      if (!token) return;

      await axios.delete(
        `${
          import.meta.env.VITE_REACT_APP_DELETE_POSTEDNOTE_ENDPOINT
        }/${noteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPostedNotes(postedNotes.filter((note) => note.note !== noteId));
    } catch (error) {
      console.error("Error deleting saved note:", error);
      setError("Failed to delete saved note. Please try again.");
    }
  };

  const handleMarkForReview = async (noteId) => {
    try {
      await markNoteForReview(noteId, false);
    } catch (error) {
      console.error("Error marking note for review:", error);
      setError("Failed to mark note for review. Please try again.");
    }
  };

  const handleMarkSavedNoteForReview = async (noteId) => {
    try {
      await markNoteForReview(noteId, true);
    } catch (error) {
      console.error("Error marking saved note for review:", error);
      setError("Failed to mark saved note for review. Please try again.");
    }
  };

  const markNoteForReview = async (noteId, isSavedNote) => {
    const token = extractTokenFromCookie();
    if (!token) return;

    await axios.patch(
      `${import.meta.env.VITE_REACT_APP_MARK_REVIEW_NOTE_ENDPOINT}/${noteId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (isSavedNote) {
      setSavedNotes(
        savedNotes.map((note) =>
          note.savedNote._id === noteId
            ? {
                ...note,
                savedNote: { ...note.savedNote, markedForReview: true },
              }
            : note
        )
      );
    } else {
      setNotes(
        notes.map((note) =>
          note._id === noteId ? { ...note, markedForReview: true } : note
        )
      );
    }
  };

  const handleUnmarkForReview = async (noteId) => {
    try {
      await unmarkNoteForReview(noteId, false);
    } catch (error) {
      console.error("Error unmarking note for review:", error);
      setError("Failed to unmark note for review. Please try again.");
    }
  };

  const handleUnmarkSavedNoteForReview = async (noteId) => {
    try {
      await unmarkNoteForReview(noteId, true);
    } catch (error) {
      console.error("Error unmarking saved note for review:", error);
      setError("Failed to unmark saved note for review. Please try again.");
    }
  };

  const unmarkNoteForReview = async (noteId, isSavedNote) => {
    const token = extractTokenFromCookie();
    if (!token) return;

    await axios.patch(
      `${import.meta.env.VITE_REACT_APP_UNMARK_REVIEW_NOTE_ENDPOINT}/${noteId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (isSavedNote) {
      setSavedNotes(
        savedNotes.map((note) =>
          note.savedNote._id === noteId
            ? {
                ...note,
                savedNote: { ...note.savedNote, markedForReview: false },
              }
            : note
        )
      );
    } else {
      setNotes(
        notes.map((note) =>
          note._id === noteId ? { ...note, markedForReview: false } : note
        )
      );
    }
  };

  const updateNotes = (newNote) => {
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  };

  const value = {
    notes,
    savedNotes,
    postedNotes,
    loading,
    error,
    setError,
    handleDeleteNote,
    handleDeleteSavedNote,
    handleDeletePostedNote,
    handleMarkForReview,
    handleMarkSavedNoteForReview,
    handleUnmarkForReview,
    handleUnmarkSavedNoteForReview,
    updateNotes,
  };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
}

export { NotesContext, NotesProvider };
