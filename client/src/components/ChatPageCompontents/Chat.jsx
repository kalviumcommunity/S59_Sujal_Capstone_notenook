import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import MessageInput from "./MessageInput";
import Message from "./Message";
import pic from "../../assets/pic.png";

const Chat = ({ selectedUser, setSelectedUser, setTopUser }) => {
  const [messages, setMessages] = useState([]);
  const lastMessageRef = useRef(null);
  const { userToChatId } = useParams();

  useEffect(() => {
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
          }
        );

        setMessages(response.data.messages);
        setSelectedUser(response.data.userToChat);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (userToChatId && token) {
      fetchMessages();
    }
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
      />
    </div>
  );
};

export default Chat;
