import React, { useState } from "react";
import "../../css/Tabs.css";
import "../../css/ProfileContent.css";

const ProfileContent = () => {
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
        {activeTab === "Notes" && <div>Notes content goes here.</div>}
        {activeTab === "Posted" && <div>Posted content goes here.</div>}
        {activeTab === "Friends" && <div>Friends content goes here.</div>}
      </div>
    </div>
  );
};

export default ProfileContent;
