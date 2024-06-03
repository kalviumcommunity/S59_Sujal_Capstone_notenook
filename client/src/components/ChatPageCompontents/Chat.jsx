import React, { useState } from "react";
import pic from "../../assets/pic.png";
import axios from "axios";
import { Link } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";

const Chat = ({ userToChatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = async () => {
    try {
      const response = await axios.post(`/send/${userToChatId}`, {
        message: newMessage,
      });
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat">
      <div className="chat-user">
        <Link to={``}>
          <div className="connection userToChat">
            <div className="connectionInfo">
              <img className="connectionPic" src={pic} alt="User" />
              <p className="connectionUsername">"username"</p>
            </div>
          </div>
        </Link>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) =>
          msg.senderId === "1" ? (
            <SentMessage
              key={index}
              message={msg.message}
              timestamp={msg.timestamp}
            />
          ) : (
            <ReceivedMessage
              key={index}
              message={msg.message}
              timestamp={msg.timestamp}
            />
          )
        )}
      </div>
      <div className="chat-input-container">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          className="chat-input"
        />
        <button onClick={sendMessage} className="chat-send-button">
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

const SentMessage = ({ message, timestamp }) => {
  return (
    <div className="chat-message sent">
      {" "}
      <div className="message-content">
        <p>{message}</p>
        <span>{new Date(timestamp).toLocaleString()}</span>
      </div>
      <img className="message-pic" src={pic} alt="User" />
    </div>
  );
};

const ReceivedMessage = ({ message, timestamp }) => {
  return (
    <div className="chat-message received">
      <img className="message-pic" src={pic} alt="User" />
      <div className="message-content">
        <p>{message}</p>
        <span>{new Date(timestamp).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default Chat;
