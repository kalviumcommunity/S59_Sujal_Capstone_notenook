import React, { useState } from "react";
import FriendsList from "./FriendsList";
import NotesList from "./NotesList";
import PostedNotesList from "./PostedNotesList";
import "../../css/Tabs.css";
import "../../css/ProfileContent.css";

const ProfileContent = ({ userInfo }) => {
  const [activeTab, setActiveTab] = useState("Notes");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="profileContent">
      <div className="tabs">
        <div
          className={`tab ${activeTab === "Notes" ? "active" : ""}`}
          onClick={() => handleTabClick("Notes")}
        >
          Notes
        </div>
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
        {activeTab === "Notes" && <NotesList notes={userInfo?.notes} />}
        {activeTab === "Posted" && <PostedNotesList postedNotes={userInfo?.postedNotes} />}
        {activeTab === "Friends" && <FriendsList friends={userInfo?.friends} />}
      </div>
    </div>
  );
};

export default ProfileContent;
