import "../css/NoteNook.css";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import DashBoard from "./DashBoard";
import { Routes, Route } from "react-router-dom";
import Connections from "../components/Connections";
import SearchNotes from "./SearchNotes";
import SearchUsers from "./SearchUsers";
import TextEditor from "../components/TextEditor";

function NoteNook() {
  console.log("App rerendered");
  return (
    <div>
      <NavBar />
      <Header />

      <div className="noteNook">
        <Routes>
          <Route path="/dashboard" element={<DashBoard />}></Route>
          <Route path="/notes" element={<SearchNotes />}></Route>
          <Route path="/friends" element={<SearchUsers />}></Route>
          <Route path="/add" element={<TextEditor />} />
        </Routes>
      </div>
    </div>
  );
}

export default NoteNook;
