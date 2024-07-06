import { useState, useContext } from "react";
import { DeviceWidthContext } from "../../context/deviceWidthContext";
import TextEditor from "./TextEditor";
import NoteDetailsForm from "./NoteDetailsForm";
import AiChat from "../AIChatComponents/AiChat";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../../css/AddNotes.css";
const WriteNote = () => {
  const [activeTab, setActiveTab] = useState("AiChat");
  const [showTools, setShowTools] = useState(false);
  const width = useContext(DeviceWidthContext);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const toggleTools = () => {
    setShowTools(!showTools);
  };

  return (
    <div className="writeNote relative">
      {width < 1024 && (
        <button className="button toolsButton" onClick={toggleTools}>
          {showTools ? "Hide Tools" : "Show Tools"}
        </button>
      )}
      <div className="writeNoteComponents">
        {width < 1024 && showTools && (
          <div className="writeNotesTools fixed">
            <Tools
              activeTab={activeTab}
              handleTabClick={handleTabClick}
              toggleTools={toggleTools}
              width={width}
            />
          </div>
        )}
        <TextEditor />
        {width >= 1024 && (
          <div className="writeNotesTools">
            <Tools
              activeTab={activeTab}
              handleTabClick={handleTabClick}
              width={width}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const Tools = ({ activeTab, handleTabClick, toggleTools, width }) => {
  return (
    <>
      <div className="tabDiv">
        {width < 1024 && (
          <div className="back-arrow button" onClick={toggleTools}>
            <ArrowBackIcon />
          </div>
        )}
        <div className="tabs writeNoteTabs">
          <div
            className={`tab ${activeTab === "AiChat" ? "active" : ""}`}
            onClick={() => handleTabClick("AiChat")}
          >
            AiChat
          </div>
          <div
            className={`tab ${activeTab === "Post" ? "active" : ""}`}
            onClick={() => handleTabClick("Post")}
          >
            Post
          </div>
        </div>
      </div>
      <div className={`aiChat ${activeTab === "AiChat" ? "active" : "hidden"}`}>
        <AiChat />
      </div>
      <div
        className={`noteDetail ${activeTab === "Post" ? "active" : "hidden"}`}
      >
        <NoteDetailsForm />
      </div>
    </>
  );
};

export default WriteNote;
