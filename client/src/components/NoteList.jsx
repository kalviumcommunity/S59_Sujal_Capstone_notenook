import { useState, useEffect } from "react";
import axios from "axios";

import Note from "./Note";
import extractTokenFromCookie from "../Functions/ExtractTokenFromCookie";

import "../css/NoteList.css";
function NoteList() {
  const [notes, setNotes] = useState([]);

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
      }
    };

    const token = extractTokenFromCookie();
    if (token) {
      fetchNotes(token);
    }
  }, []);

  return (
    <div className="noteList relative">
      {!notes.length && <p className="placeHolder">Your Notes Appear here</p>}
      <h1 className="heading">My Notes</h1>
      <div className="notesDisplay">
        {notes.length !== 0 &&
          notes.map((note, i) => <Note note={note} key={i} />)}
      </div>
    </div>
  );
}

export default NoteList;
