import { useContext } from "react";

import { AuthContext } from "../../context/authContext";

import MyNote from "./MyNote";

import "../../css/NoteList.css";

function MyNoteList({ handleClick }) {
  const { user } = useContext(AuthContext);

  return (
    <div className="myNoteList">
      <div className="flex w-full justify-between p-4">
        <h1 className="heading">My Notes</h1>
        <button onClick={handleClick} className="button">
          New Note
        </button>
      </div>
      <div className="myNotes">
        {user?.notes.map((note, i) => {
          return <MyNote note={note} key={i} />;
        })}
      </div>
    </div>
  );
}

export default MyNoteList;
