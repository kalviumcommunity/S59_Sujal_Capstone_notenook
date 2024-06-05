import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom";

import { DeviceWidthContext } from "../../context/deviceWidthContext";

import ChatSidebar from "../../components/ChatPageCompontents/ChatSidebar";
import Chat from "../../components/ChatPageCompontents/Chat";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import "../../css/ChatPage.css";

const ChatPage = () => {
  const width = useContext(DeviceWidthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [topUser, setTopUser] = useState(null);

  useEffect(() => {
    const token = extractTokenFromCookie();
    if (!token) {
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_REACT_APP_GETCHATS_ENDPOINT,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users for chat:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="chat-page">
      {width > 900 ? (
        <>
          <ChatSidebar
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            topUser={topUser}
          />
          <Routes>
            <Route
              path="/:userToChatId"
              element={
                <Chat
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  setTopUser={setTopUser}
                />
              }
            />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <ChatSidebar
                users={users}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                topUser={topUser}
              />
            }
          />
          <Route
            path="/:userToChatId"
            element={
              <Chat
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default ChatPage;
