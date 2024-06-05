import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

const MessageInput = ({
  userToChatId,
  setMessages,
  messages,
  setTopUser,
  selectedUser,
}) => {
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = async () => {
    const token = extractTokenFromCookie();
    if (!token || !newMessage.trim()) {
      return;
    }
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_SEND_MESSAGE_ENDPOINT
        }/${userToChatId}`,
        {
          message: newMessage,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );
      setMessages([...messages, response.data]);
      setNewMessage("");
      setTopUser(selectedUser);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
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
  );
};

export default MessageInput;
