import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
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
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="chat-input-container">
      <textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
        className="chat-input"
        disabled={isLoading} 
      />
      {isLoading ? (
        <CircularProgress size={24} />
      ) : (
        <button onClick={sendMessage} className="chat-send-button">
          <SendIcon />
        </button>
      )}
    </div>
  );
};

export default MessageInput;
