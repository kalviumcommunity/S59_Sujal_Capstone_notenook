import React from "react";
import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";

function Stats() {
  return (
    <div className="stats dashBoardComponent">
      <h1 className="heading">Stats</h1>
      <div className="flex gap-10">
        <div className="statDiv">
          <p>No. of Connections</p>
          <div>
            <PeopleIcon /> <span>00</span>
          </div>
        </div>
        <div className="statDiv">
          <p>No. of Notes Posted</p>
          <div>
            <EventNoteIcon>
              <span>00</span>
            </EventNoteIcon>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
