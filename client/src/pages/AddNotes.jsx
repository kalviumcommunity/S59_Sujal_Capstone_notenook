import React from "react";
import "../css/AddNotes.css";
import { Routes, Route } from "react-router-dom";
import WriteNote from "../components/WriteNote";
import MyNotes from "../components/MyNotes";

function AddNotes() {
  return (
    <div className="addNotesPage relative">
      <div className="addNotes">
        <Routes>
          <Route path="/" element={<MyNotes />}></Route>
          <Route path="/writeNote/:documentId" element={<WriteNote />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default AddNotes;
