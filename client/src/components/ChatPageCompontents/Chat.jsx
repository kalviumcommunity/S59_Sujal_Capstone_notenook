import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import MessageInput from "./MessageInput";
import { io } from "socket.io-client";
import Message from "./Message";
import pic from "../../assets/pic.png";

const Chat = ({ selectedUser, setSelectedUser, setTopUser }) => {
  const [messages, setMessages] = useState([]);
  const [chatSocket, setChatSocket] = useState(null);
  const lastMessageRef = useRef(null);
  const { userToChatId } = useParams();

  useEffect(() => {
    const token = extractTokenFromCookie();
    if (!token) {
      return;
    }
    const socketConnection = io(
      import.meta.env.VITE_REACT_APP_CHAT_SOCKET_ENDPOINT,
      {
        auth: { token },
      }
    );

    setChatSocket(socketConnection);

    socketConnection.on("connectionSuccess", (data) => {
      console.log(data.message);
    });

    socketConnection.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const token = extractTokenFromCookie();

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_GET_MESSAGES_ENDPOINT
          }/${userToChatId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cancelToken: source.token,
          }
        );

        setMessages(response.data.messages);
        setSelectedUser(response.data.userToChat);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Error fetching messages:", error);
        }
      }
    };

    if (userToChatId && token) {
      fetchMessages();
    }

    return () => {
      source.cancel("Component unmounted");
    };
  }, [userToChatId, setSelectedUser]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat-user">
        <Link to={``}>
          <div className="connection userToChat">
            <div className="connectionInfo">
              <img className="connectionPic" src={pic} alt="User" />
              <p className="connectionUsername">{selectedUser?.username}</p>
            </div>
          </div>
        </Link>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} ref={lastMessageRef} className="flex flex-col">
            <Message
              message={msg.message}
              createdAt={msg.createdAt}
              senderId={msg.senderId}
              selectedUser={selectedUser}
            />
          </div>
        ))}
      </div>
      <MessageInput
        userToChatId={userToChatId}
        setMessages={setMessages}
        messages={messages}
        setTopUser={setTopUser}
        selectedUser={selectedUser}
        chatSocket={chatSocket}
      />
    </div>
  );
};

export default Chat;
