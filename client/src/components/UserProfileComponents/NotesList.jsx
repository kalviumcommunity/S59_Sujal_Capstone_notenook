import { useState, useEffect } from "react";
import axios from "axios";

import MyNote from "../AddNotesComponent/MyNote";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import "../../css/NoteList.css";

function NotesList({ notes }) {
  const handleDelete = async (noteId) => {
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

  return (
    <div className="myNoteList">
      <div className="myNotes">
        {notes &&
          notes.map((note) => (
            <MyNote key={note._id} note={note} handleDelete={handleDelete} />
          ))}
      </div>
    </div>
  );
}

export default NotesList;
