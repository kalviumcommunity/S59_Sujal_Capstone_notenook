import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";

import { DeviceWidthContext } from "../../context/deviceWidthContext";
import ChatSidebar from "../../components/ChatPageCompontents/ChatSidebar";
import Chat from "../../components/ChatPageCompontents/Chat";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import "../../css/ChatPage.css";

const ChatPage = () => {
  const width = useContext(DeviceWidthContext);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
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
        setUsers(response.data.users);
        setFriends(response.data.friends);
      } catch (error) {
        console.error("Error fetching users for chat:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (topUser) {
      setUsers((prevUsers) => {
        const userIndex = prevUsers.findIndex(
          (user) => user._id === topUser._id
        );
        if (userIndex > -1) {
          const updatedUsers = [...prevUsers];
          const [userToMove] = updatedUsers.splice(userIndex, 1);
          updatedUsers.unshift(userToMove);
          return updatedUsers;
        }
        return prevUsers;
      });
    }
  }, [topUser]);

  useEffect(() => {
    if (selectedUser) {
      setUsers((prevUsers) => {
        const userIndex = prevUsers.findIndex(
          (user) => user._id === selectedUser._id
        );
        if (userIndex === -1) {
          return [selectedUser, ...prevUsers];
        }
        return prevUsers;
      });
    }
  }, [selectedUser]);

  return (
    <div className="chat-page">
      {width > 900 ? (
        <>
          <ChatSidebar
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            topUser={topUser}
            friends={friends}
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
                friends={friends}
              />
            }
          />
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
      )}
    </div>
  );
};

export default ChatPage;
