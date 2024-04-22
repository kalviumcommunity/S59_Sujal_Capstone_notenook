import React, { useContext, useState } from "react";
import TextEditor from "../components/TextEditor";
import "../css/AddNotes.css";
import { Routes, Route, Link } from "react-router-dom";
import NoteDetailsForm from "../components/NoteDetailsForm";
import MyNoteList from "../components/MyNoteList";
import NewNoteForm from "../components/NewNoteForm";
import { DeviceWidthContext } from "../context/deviceWidthContext";
function AddNotes() {
  return (
    <div className="addNotesPage relative">
      <div className="addNotes">
        <Routes>
          <Route path="/" element={<MyNotes />}></Route>
          <Route path="/newNote" element={<NewNote />}></Route>
        </Routes>
      </div>
    </div>
  );
}

function MyNotes() {
  const [postNewNote, setPostNewNote] = useState(false);
  const width = useContext(DeviceWidthContext);
  const handleClick = () => {
    setPostNewNote(!postNewNote);
  };
  return (
    <>
      {postNewNote && (
        <NewNoteForm
          postNewNote={postNewNote}
          setPostNewNote={setPostNewNote}
          handleClick={handleClick}
        />
      )}
      <MyNoteList
        postNewNote={postNewNote}
        setPostNewNote={setPostNewNote}
        handleClick={handleClick}
      />

      {width < 1024 && (
        <div className="w-full flex justify-between items-center flex-col">
          <p className="mb-4">Wanna add a note?</p>
          <Link to={"newNote"}>
            <button className="button">Upload a new note?</button>
          </Link>
        </div>
      )}
    </>
  );
}
function NewNote() {
  return (
    <>
      <TextEditor />
      <NoteDetailsForm />
    </>
  );
}

export default AddNotes;
