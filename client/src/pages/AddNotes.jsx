import React from "react";
import TextEditor from "../components/TextEditor";
import "../css/AddNotes.css";
import { Routes, Route, Link } from "react-router-dom";
import NoteDetailsForm from "../components/NoteDetailsForm";
import MyNoteList from "../components/MyNoteList";
function AddNotes() {
  return (
    <div className="addNotesPage">
      <div className="addNotes">
        <Routes>
          <Route path="/" element={<MyNoteList />}></Route>
          <Route path="/newNote" element={<NewNote />}></Route>
        </Routes>
      </div>
    </div>
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
