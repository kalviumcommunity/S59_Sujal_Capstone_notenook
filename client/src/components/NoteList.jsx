import React, { useState, useEffect } from "react";
import axios from "axios";
import Note from "./Note";
import "../css/NoteList.css";
function NoteList() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async (token) => {
      console.log("es");
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
        console.log(notes);
        console.log(response);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    const tokenCookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));

    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
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
