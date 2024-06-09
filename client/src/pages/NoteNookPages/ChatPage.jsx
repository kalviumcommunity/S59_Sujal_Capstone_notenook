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
  const [chatSocket, setChatSocket] = useState(null);

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
    const token = extractTokenFromCookie();
    if (!token) {
      console.error("No token found");
      return;
    }

    const socketConnection = io(
      import.meta.env.VITE_REACT_APP_CHAT_SOCKET_ENDPOINT,
      {
        auth: { token },
      }
    );

    setChatSocket(socketConnection);

    socketConnection.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    socketConnection.on("connectionSuccess", (data) => {
      console.log(data.message);
    });

    socketConnection.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketConnection.on("newChatCreated", (newChat) => {
      setUsers((prevUsers) => {
        return [
          { _id: newChat.senderId, username: newChat.senderUsername },
          ...prevUsers,
        ];
      });
    });

    return () => {
      socketConnection.disconnect();
    };
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
                  chatSocket={chatSocket}
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
                chatSocket={chatSocket}
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default ChatPage;
