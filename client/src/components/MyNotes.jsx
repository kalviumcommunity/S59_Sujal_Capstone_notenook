import { useContext,useState } from "react";
import MyNoteList from "./MyNoteList";import { Link } from "react-router-dom";
import NewNoteForm from "./NewNoteForm";
import { DeviceWidthContext } from "../context/deviceWidthContext";

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
          <Link to={"newNote"}>
            <button className="button">Upload a new note</button>
          </Link>
        </div>
      )}
    </>
  );
}

export default MyNotes