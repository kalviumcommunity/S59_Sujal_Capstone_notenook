import React, { useState } from "react";
import TextEditor from "../components/TextEditor";
import "../css/AddNotes.css";
import NoteDetailsForm from "../components/NoteDetailsForm";
function AddNotes() {
  return (
    <div className="addNotesPage">
      <div className="addNotes">
        <TextEditor />
        <NoteDetailsForm></NoteDetailsForm>
      </div>
    </div>
  );
}

export default AddNotes;
