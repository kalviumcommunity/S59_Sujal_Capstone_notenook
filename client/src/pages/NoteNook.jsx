import { useEffect, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { DeviceWidthProvider } from "../context/deviceWidthContext";
import { NotesProvider } from "../context/notesContext";
import extractTokenFromCookie from "../Functions/ExtractTokenFromCookie";

import Header from "../components/Header";
import NavBar from "../components/NavBar";
import DashBoard from "./NoteNookPages/DashBoard";
import SearchNotes from "./NoteNookPages/SearchNotes";
import SearchUsers from "./NoteNookPages/SearchUsers";
import AddNotes from "./NoteNookPages/AddNotes";
import ViewNote from "./NoteNookPages/ViewNote";
import UserProfile from "./NoteNookPages/UserProfile";
import NotificationPage from "./NoteNookPages/NotificationPage";
import ViewUser from "./NoteNookPages/ViewUser";
import ChatPage from "./NoteNookPages/ChatPage";

import { UserContext } from "../context/userContext";
import axios from "axios";
import "../css/NoteNook.css";

function NoteNook() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async (token) => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_REACT_APP_USER_DETAIL_ENDPOINT,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setUser(response.data.user);
        }
      } catch (err) {
        if (err.response?.status == 401) {
          alert("Session expired, please login again!!");
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          navigate("/");
        }
      }
    };

    const token = extractTokenFromCookie();
    if (token) {
      fetchData(token);
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <NavBar />
      <Header />
      <DeviceWidthProvider>
        <NotesProvider>
          <div className="noteNook">
            <Routes>
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/notes" element={<SearchNotes />} />
              <Route path="/friends" element={<SearchUsers />} />
              <Route path="/postNotes/*" element={<AddNotes />} />
              <Route path="/viewNote/:documentId" element={<ViewNote />} />
              <Route path="/profile/*" element={<UserProfile />} />
              <Route path="/notifications" element={<NotificationPage />} />
              <Route path="/viewUser/:userId" element={<ViewUser />} />
              <Route path="/chatPage/*" element={<ChatPage />} />
            </Routes>
          </div>
        </NotesProvider>
      </DeviceWidthProvider>
    </div>
  );
}

export default NoteNook;
