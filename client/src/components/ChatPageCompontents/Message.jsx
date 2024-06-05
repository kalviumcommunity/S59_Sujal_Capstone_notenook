import React from "react";
import { format, getYear } from "date-fns";
import pic from "../../assets/pic.png";

const Message = ({ message, createdAt, senderId, selectedUser }) => {
  const date = new Date(createdAt);
  const currentYear = new Date().getFullYear();
  const isReceived = senderId === selectedUser.id;

  const formatString =
    getYear(date) === currentYear ? "MM/dd, h:mm a" : "MM/dd/yyyy, h:mm a";

  return (
    <div className={`chat-message ${isReceived ? "received" : "sent"}`}>
      {isReceived && <img className="message-pic" src={pic} alt="User" />}

      <div className="message-content">
        <p>{message}</p>
        <span>{format(date, formatString)}</span>
      </div>
      {isReceived ? null : <img className="message-pic" src={pic} alt="User" />}
    </div>
  );
};

export default Message;
