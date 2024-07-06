import { useEffect, useContext, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { DeviceWidthProvider } from "../context/deviceWidthContext";
import { NotesProvider } from "../context/notesContext";
import extractTokenFromCookie from "../Functions/ExtractTokenFromCookie";

import Header from "../components/HeaderComponents/Header";
import NavBar from "../components/NavBar";
import DashBoard from "./NoteNookPages/DashBoard";
import SearchNotesPage from "./NoteNookPages/SearchNotesPage";
import SearchUsersPage from "./NoteNookPages/SearchUsersPage";
import MyNotesPage from "./NoteNookPages/MyNotesPage";
import ViewNotePage from "./NoteNookPages/ViewNotePage";
import UserProfilePage from "./NoteNookPages/UserProfilePage";
import EditUserDetailsPage from "./NoteNookPages/EditUserDetailsPage";
import NotificationPage from "./NoteNookPages/NotificationPage";
import ViewUserPage from "./NoteNookPages/ViewUserPage";
import ChatPage from "./NoteNookPages/ChatPage";
import Loader from "../components/Loaders/Loader";
import PhoneNavBar from "../components/PhoneNavBar";

import { UserContext } from "../context/userContext";
import axios from "axios";

function NoteNook() {
  const [isFetchingUserData, setIsFetchingUserData] = useState(true);
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
      } finally {
        setIsFetchingUserData(false);
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
    <div className="h-screen w-screen">
      {isFetchingUserData && (
        <div className="fixed top-0 left-0 w-screen h-screen z-50 bg-[#09090b]">
          <Loader action={"Loading Data..."} />
        </div>
      )}
      <NavBar />
      <PhoneNavBar />
      <Header />
      <DeviceWidthProvider>
        <NotesProvider>
          <div className="noteNook css fixed top-24 overflow-y-scroll left-24 rounded-tl-md bg-muted/5 p-4">
            <Routes>
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/notes" element={<SearchNotesPage />} />
              <Route path="/myNotes/*" element={<MyNotesPage />} />
              <Route path="/friends" element={<SearchUsersPage />} />
              <Route path="/chatPage/*" element={<ChatPage />} />
              <Route path="/profile/*" element={<UserProfilePage />} />
              <Route path="/profile/edit" element={<EditUserDetailsPage />} />
              <Route path="/viewUser/:userId" element={<ViewUserPage />} />
              <Route path="/viewNote/:documentId" element={<ViewNotePage />} />
              <Route path="/notifications" element={<NotificationPage />} />
            </Routes>
          </div>
        </NotesProvider>
      </DeviceWidthProvider>
    </div>
  );
}

export default NoteNook;
