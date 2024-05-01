import "../css/NoteNook.css";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import DashBoard from "./NoteNookPages/DashBoard";
import { Routes, Route, useNavigate } from "react-router-dom";
import SearchNotes from "./NoteNookPages/SearchNotes";
import SearchUsers from "./NoteNookPages/SearchUsers";
import { DeviceWidthProvider } from "../context/deviceWidthContext";
import AddNotes from "./NoteNookPages/AddNotes";
import { useEffect } from "react";
import extractTokenFromCookie from "../Functions/ExtractTokenFromCookie";
function NoteNook() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = extractTokenFromCookie();

    if (!token) {
      navigate("/");
    }
  }, []);

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
