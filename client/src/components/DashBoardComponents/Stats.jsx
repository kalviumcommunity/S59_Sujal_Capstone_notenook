import React from "react";
import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

function Stats() {
  const { user } = useContext(AuthContext);

  const noOfNotes = user.user.notes.length;
  const noOfFriends = user.user.friends.length;
  return (
    <div className="stats dashBoardComponent">
      <h1 className="heading">Stats</h1>
      <div className="flex gap-10">
        <div className="statDiv">
          <p>No. of Connections</p>

          <div>
            <div className="iconDiv connectionsStat">
              <PeopleIcon style={{ color: "white" }} fontSize="small" />
            </div>

            <span className="statNumber">{noOfNotes}</span>
          </div>
        </div>
        <div className="statDiv">
          <p>No. of Notes Posted</p>

          <div>
            <div className="iconDiv notesStat">
              <EventNoteIcon style={{ color: "white" }} fontSize="small" />
            </div>
            <span className="statNumber">{noOfFriends}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
