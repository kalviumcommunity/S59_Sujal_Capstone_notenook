import { useState } from "react";

import NewNoteForm from "./NewNoteForm";
import MyNoteList from "./MyNoteList";
import SavedList from "./SavedList.jsx";
import ReviewList from "../NoteLists/ReviewList";

function MyNotes() {
  const [postNewNote, setPostNewNote] = useState(false);
  const [activeTab, setActiveTab] = useState("MyNotes");
  const [error, setError] = useState(null);

  const handleClick = () => {
    setPostNewNote(!postNewNote);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      {postNewNote && <NewNoteForm handleClick={handleClick} />}
      <div className="flex w-full justify-between p-4">
        <h1 className="heading">My Notes</h1>
        <button onClick={handleClick} className="button">
          New Note
        </button>
      </div>
      <div className="tabs">
        <div
          className={`tab ${activeTab === "MyNotes" ? "active" : ""}`}
          onClick={() => handleTabClick("MyNotes")}
        >
          My Notes
        </div>
        <div
          className={`tab ${activeTab === "Saved" ? "active" : ""}`}
          onClick={() => handleTabClick("Saved")}
        >
          Saved
        </div>
        <div
          className={`tab ${activeTab === "Review" ? "active" : ""}`}
          onClick={() => handleTabClick("Review")}
        >
          Review
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}{" "}
      <div className="tab-content">
        {activeTab === "MyNotes" && <MyNoteList setError={setError} />}
        {activeTab === "Saved" && <SavedList setError={setError} />}
        {activeTab === "Review" && <ReviewList setError={setError} />}
      </div>
    </>
  );
}

export default MyNotes;
