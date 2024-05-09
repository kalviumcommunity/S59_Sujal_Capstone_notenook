import { useState, useEffect } from "react";
import axios from "axios";

import MyNote from "./MyNote";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import "../../css/NoteList.css";

function MyNoteList({ handleClick }) {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchNotes = async (token) => {
      try {
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
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError("Failed to fetch notes. Please try again.");
      }
    };

    const token = extractTokenFromCookie();
    if (token) {
      fetchNotes(token);
    }
  }, []);

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
      <div className="flex w-full justify-between p-4">
        <h1 className="heading">My Notes</h1>
        <button onClick={handleClick} className="button">
          New Note
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}{" "}
      <div className="myNotes">
        {notes.map((note) => (
          <MyNote key={note._id} note={note} handleDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default MyNoteList;
