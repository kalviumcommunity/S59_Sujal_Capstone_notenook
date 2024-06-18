import { useState, useContext } from "react";

import { NotesContext } from "../../context/notesContext";

import MyReviewNote from "./MyReviewNote";
import MySavedReviewNote from "./MySavedReviewNote";

function ReviewList() {
  const {
    notes,
    savedNotes,
    handleMarkForReview,
    handleUnmarkForReview,
    handleMarkSavedNoteForReview,
    handleUnmarkSavedNoteForReview,
  } = useContext(NotesContext);
  const [activeTab, setActiveTab] = useState("Normal");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const filteredNotes = notes.filter((note) => note.markedForReview);
  const filteredSavedNotes = savedNotes.filter(
    (savedNote) => savedNote.savedNote.markedForReview
  );

  return (
    <>
      <div className="tabs">
        <div
          className={`tab ${activeTab === "Normal" ? "active" : ""}`}
          onClick={() => handleTabClick("Normal")}
        >
          My Notes
        </div>
        <div
          className={`tab ${activeTab === "Saved" ? "active" : ""}`}
          onClick={() => handleTabClick("Saved")}
        >
          Saved Notes
        </div>
      </div>
      <div className="tab-content ">
        {activeTab === "Normal" && (
          <div className="myNotes">
            {filteredNotes.map((note) => (
              <MyReviewNote
                key={note._id}
                note={note}
                handleMarkForReview={handleMarkForReview}
                handleUnmarkForReview={handleUnmarkForReview}
              />
            ))}
          </div>
        )}
        {activeTab === "Saved" && (
          <div className="myNotes">
            {filteredSavedNotes.map((savedNote) => (
              <MySavedReviewNote
                key={savedNote.savedNote._id}
                savedNote={savedNote.savedNote}
                originalNoteId={savedNote.originalNote}
                handleMarkForReview={handleMarkSavedNoteForReview}
                handleUnmarkForReview={handleUnmarkSavedNoteForReview}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ReviewList;
