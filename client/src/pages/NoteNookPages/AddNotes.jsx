import { Routes, Route } from "react-router-dom";

import WriteNote from "../../components/AddNotesComponent/WriteNote";
import MyNotes from "../../components/AddNotesComponent/MyNotes";

import "../../css/AddNotes.css";

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
