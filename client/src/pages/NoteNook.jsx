import "../css/NoteNook.css";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import DashBoard from "./DashBoard";
import { Routes, Route, useNavigate } from "react-router-dom";
import SearchNotes from "./SearchNotes";
import SearchUsers from "./SearchUsers";
import { DeviceWidthProvider } from "../context/deviceWidthContext";
import AddNotes from "./AddNotes";
import { useEffect } from "react";
function NoteNook() {
  const navigate = useNavigate();
  useEffect(() => {
    const cookies = document.cookie;
    console.log(cookies)
    if (cookies) {
      const tokenCookie = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("token="))
        .split("=")[1];
      if (!tokenCookie) {
        navigate("/");
      }
    } else {
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
