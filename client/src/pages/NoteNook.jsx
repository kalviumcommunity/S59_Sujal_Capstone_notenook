import "../css/NoteNook.css";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import DashBoard from "./DashBoard";
import { Routes, Route } from "react-router-dom";
import SearchNotes from "./SearchNotes";
import SearchUsers from "./SearchUsers";
import { DeviceWidthProvider } from "../context/deviceWidthContext";
import AddNotes from "./AddNotes";
function NoteNook() {
  console.log("App rerendered");
  return (
    <div>
      <NavBar />
      <Header />
      <DeviceWidthProvider>
        <div className="noteNook">
          <Routes>
            <Route path="/dashboard" element={<DashBoard />}></Route>
            <Route path="/notes" element={<SearchNotes />}></Route>
            <Route path="/friends" element={<SearchUsers />}></Route>
            <Route path="/postNotes/*" element={<AddNotes />} />
          </Routes>
        </div>
      </DeviceWidthProvider>
    </div>
  );
}

export default NoteNook;
