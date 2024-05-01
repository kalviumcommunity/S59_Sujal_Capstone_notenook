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
        console.log(notes);
        console.log(response);
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
        {notes.map((note, i) => {
          return <MyNote note={note} key={i} />;
        })}
      </div>
    </div>
  );
}

export default MyNoteList;
