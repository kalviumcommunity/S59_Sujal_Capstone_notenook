import React, { useEffect, useContext, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { DeviceWidthProvider } from "../context/deviceWidthContext";
import { NotesProvider } from "../context/notesContext";
import extractTokenFromCookie from "../Functions/ExtractTokenFromCookie";
import axios from "axios";

import Header from "../components/HeaderComponents/Header";
import NavBar from "../components/NavBar";
import DashBoard from "./NoteNookPages/DashBoard";
import SearchNotesPage from "./NoteNookPages/SearchNotesPage";
import SearchUsersPage from "./NoteNookPages/SearchUsersPage";
import MyNotesPage from "./NoteNookPages/MyNotesPage";
import ViewNotePage from "./NoteNookPages/ViewNotePage";
import UserProfilePage from "./NoteNookPages/UserProfilePage";
import EditUserDetailsPage from "./NoteNookPages/EditUserDetailsPage";
import NotificationsPage from "./NoteNookPages/NotificationsPage";
import ViewUserPage from "./NoteNookPages/ViewUserPage";
import ChatPage from "./NoteNookPages/ChatPage";
import Loader from "../components/Loaders/Loader";
import PhoneNavBar from "../components/PhoneNavBar";
import AiChat from "../components/AIChatComponents/AiChat";
import { UserContext } from "../context/userContext";

function NoteNook() {
  const [isFetchingUserData, setIsFetchingUserData] = useState(true);
  const { setUser } = useContext(UserContext);
  const [isAiChatVisible, setIsAiChatVisible] = useState(false);
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
          handleSessionExpiration();
        }
      } finally {
        setIsFetchingUserData(false);
      }
    };

    const handleSessionExpiration = () => {
      alert("Session expired, please login again!!");
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/");
    };

    const token = extractTokenFromCookie();
    if (token) {
      fetchData(token);
    } else {
      navigate("/");
    }
  }, [navigate, setUser]);

  return (
    <div className="h-screen w-screen">
      {isFetchingUserData && (
        <div className="fixed top-0 left-0 w-screen h-screen z-50 bg-[#09090b]">
          <Loader action={"Loading Data..."} />
        </div>
      )}
      <NavBar
        setIsAiChatVisible={setIsAiChatVisible}
        isAiChatVisible={isAiChatVisible}
      />
      <PhoneNavBar
        setIsAiChatVisible={setIsAiChatVisible}
        isAiChatVisible={isAiChatVisible}
      />
      <Header />
      <DeviceWidthProvider>
        <NotesProvider>
          <div className="noteNook css fixed top-24 overflow-y-scroll left-24 rounded-tl-md bg-muted/5 p-4">
            <div
              className={`absolute z-[100] top-8 left-4 h-[calc(100%-4rem)] transition-transform duration-300 ${
                isAiChatVisible ? "scale-100" : "scale-0"
              }`}
            >
              <AiChat setIsAiChatVisible={setIsAiChatVisible} />
            </div>

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
              <Route path="/notifications" element={<NotificationsPage />} />
            </Routes>
          </div>
        </NotesProvider>
      </DeviceWidthProvider>
    </div>
  );
}

export default NoteNook;
