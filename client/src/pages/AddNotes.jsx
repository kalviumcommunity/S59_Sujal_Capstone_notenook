import React from "react";
import TextEditor from "../components/TextEditor";
import "../css/AddNotes.css";
import { Routes, Route, Link } from "react-router-dom";
import NoteDetailsForm from "../components/NoteDetailsForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
function AddNotes() {
  return (
    <div className="addNotesPage">
      <div className="addNotes">
        <Routes>
          <Route path="/" element={<MyNotesList />}></Route>
          <Route path="/newNote" element={<NewNote />}></Route>
        </Routes>
      </div>
    </div>
  );
}

function MyNotesList() {
  return (
    <>
      <div className="myNotesList">
        <div className="flex  w-full justify-between">
          <h1 className="heading">My Notes</h1>
          <Link to={"newNote"}>
            <button className="button">New Note</button>
          </Link>
        </div>
      </div>
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
