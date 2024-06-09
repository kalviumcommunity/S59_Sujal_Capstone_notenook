import React, { useContext, useState } from "react";
import FriendNotification from "./FriendNotification";
import NoteNotification from "./NoteNotification";
import { UserContext } from "../../context/userContext";

function Notifications() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("friends");

  const renderContent = () => {
    if (!user || !user.notifications) {
      return <div>Loading...</div>;
    }

    if (activeTab === "friends") {
      return user.notifications?.userNotifications?.map(
        (notification, index) => (
          <FriendNotification key={index} notification={notification} />
        )
      );
    } else if (activeTab === "notes") {
      return user.notifications?.postNotifications?.map(
        (notification, index) => (
          <NoteNotification key={index} notification={notification} />
        )
      );
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
