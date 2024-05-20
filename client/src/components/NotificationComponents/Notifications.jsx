import React, { useState } from "react";
import FriendNotification from "./FriendNotification";
import NoteNotification from "./NoteNotification";

const sampleNotifications = {
  friends: [
    {
      username: "John Doe",
      message: "Friend request from John Doe",
      date: new Date().toString(),
    },
    {
      username: "Angel Doe",
      message: "Angel Doe accepted your friend request",
      date: new Date().toString(),
    },
    {
      username: "John Doe",
      message: "Friend request from John Doe",
      date: new Date().toString(),
    },
    {
      username: "Angel Doe",
      message: "Angel Doe accepted your friend request",
      date: new Date().toString(),
    },
  ],
  notes: [
    {
      username: "John Doe",
      message: "John Doe liked your note",
      note: "BOCS CA-2",
      date: new Date().toString(),
    },
    {
      username: "John Doe",
      message: "John Doe commented on your note",
      note: "BOCS CA-2",
      date: new Date().toString(),
    },
  ],
};

function Notifications() {
  const [activeTab, setActiveTab] = useState("friends");

  const renderContent = () => {
    if (activeTab === "friends") {
      return sampleNotifications.friends.map((notification, index) => (
        <FriendNotification
          key={index}
          username={notification.username}
          message={notification.message}
          date={notification.date}
        />
      ));
    } else if (activeTab === "notes") {
      return sampleNotifications.notes.map((notification, index) => (
        <NoteNotification
          key={index}
          username={notification.username}
          message={notification.message}
          note={notification.note}
          date={notification.date}
        />
      ));
    }
    return null;
  };

  return (
    <div className="notifications-container">
      <div className="tabs">
        <div
          className={`tab ${activeTab === "friends" ? "active" : ""}`}
          onClick={() => setActiveTab("friends")}
        >
          Friends
        </div>
        <div
          className={`tab ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          Notes
        </div>
      </div>
      <div className="notifications">{renderContent()}</div>
    </div>
  );
}

export default Notifications;
