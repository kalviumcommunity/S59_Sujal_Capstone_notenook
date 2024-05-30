import React, { useState } from "react";
import FriendsList from "./FriendsList";
import PostedNotesList from "./PostedNotesList";
import "../../css/Tabs.css";
import "../../css/ProfileContent.css";

function ViewUserProfileContent({ userInfo }) {
  const [activeTab, setActiveTab] = useState("Posted");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="profileContent">
      <div className="tabs">
        <div
          className={`tab ${activeTab === "Posted" ? "active" : ""}`}
          onClick={() => handleTabClick("Posted")}
        >
          Posted
        </div>
        <div
          className={`tab ${activeTab === "Friends" ? "active" : ""}`}
          onClick={() => handleTabClick("Friends")}
        >
          Friends
        </div>
      </div>
      <div className="tab-content">
        {activeTab === "Posted" && (
          <PostedNotesList postedNotes={userInfo?.postedNotes} />
        )}
        {activeTab === "Friends" && <FriendsList friends={userInfo?.friends} />}
      </div>
    </div>
  );
}

export default ViewUserProfileContent;
