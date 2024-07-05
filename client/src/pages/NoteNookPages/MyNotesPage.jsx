import { Routes, Route } from "react-router-dom";

import WriteNote from "../../components/MyNotesPageComponents/WriteNote";
import NotesList from "../../components/MyNotesPageComponents/NotesList";
import NewNoteForm from "../../components/MyNotesPageComponents/NewNoteForm";
import "../../css/AddNotes.css";

function MyNotes() {
  return (
    <div className="myNotesPage scrollHidden relative">
      <div className="page">
        <Routes>
          <Route path="/" element={<NotesList />} />
          <Route path="/createNote" element={<NewNoteForm />} />
          <Route path="/writeNote/:documentId" element={<WriteNote />} />
        </Routes>
      </div>
    </div>
  );
}

export default MyNotes;
