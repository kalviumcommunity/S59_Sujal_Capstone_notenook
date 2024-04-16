import "../css/NoteNook.css";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import DashBoard from "./DashBoard";
import { Routes, Route } from "react-router-dom";
import Connections from "../components/Connections";
import SearchNotes from "./SearchNotes";
import SearchUsers from "./SearchUsers";

function NoteNook() {
  return (
    <div>
      <NavBar />
      <Header />

      <div className="noteNook">
        <Routes>
          <Route path="/dashboard" element={<DashBoard />}></Route>
          <Route path="/notes" element={<SearchNotes />}></Route>
          <Route path="/friends" element={<SearchUsers />}></Route>
        </Routes>
        <Connections />
      </div>
    </div>
  );
}

export default NoteNook;
