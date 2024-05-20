import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { DeviceWidthContext } from "../../context/deviceWidthContext";

import NewNoteForm from "./NewNoteForm";
import MyNoteList from "./MyNoteList";

function MyNotes() {
  const [postNewNote, setPostNewNote] = useState(false);
  const width = useContext(DeviceWidthContext);
  const handleClick = () => {
    setPostNewNote(!postNewNote);
  };
  return (
    <>
      {postNewNote && <NewNoteForm handleClick={handleClick} />}

      <MyNoteList handleClick={handleClick} />

      {width < 1024 && (
        <div className="w-full flex justify-between items-center flex-col">
          <p className="mb-4">Wanna add a note?</p>
          <button onClick={handleClick} className="button">
            New Note
          </button>
        </div>
      )}
    </>
  );
}

export default MyNotes;
