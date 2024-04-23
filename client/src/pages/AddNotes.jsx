import React, { useContext, useState } from "react";
import "../css/AddNotes.css";
import { Routes, Route, Link } from "react-router-dom";
import MyNoteList from "../components/MyNoteList";
import NewNoteForm from "../components/NewNoteForm";
import WriteNote from "../components/WriteNote";
import MyNotes from "../components/MyNotes";
import { DeviceWidthContext } from "../context/deviceWidthContext";
function AddNotes() {
  return (
    <div className="addNotesPage relative">
      <div className="addNotes">
        <Routes>
          <Route path="/" element={<MyNotes />}></Route>
          <Route path="/writeNote/:id" element={<WriteNote />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default AddNotes;
