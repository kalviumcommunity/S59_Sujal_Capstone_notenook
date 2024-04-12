import React from "react";
import { NavLink } from "react-router-dom";
import "../css/NavBar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

function NavBar() {
  const style = {
    color: "white",
  };

  return (
    <div className="navBar">
      <div className="navButtons">
        <NavLink className="dashBoardIcon navButton" to="/notenook/dashboard">
          <DashboardIcon style={style} fontSize="small" />
        </NavLink>

        <NavLink className="noteIcon navButton" to="/notenook/notes">
          <EventNoteIcon style={style} fontSize="small"/>
        </NavLink>

        <NavLink className="addIcon navButton" to="/notenook/add">
          <AddCircleIcon style={style} fontSize="small"/>
        </NavLink>

        <NavLink className="friendsIcon navButton" to="/notenook/friends">
          <PeopleAltIcon style={style} fontSize="small"/>
        </NavLink>

        <NavLink className="chatIcon navButton" to="/notenook/chat">
          <ChatBubbleIcon style={style} fontSize="small"/>
        </NavLink>
      </div>
    </div>
  );
}

export default NavBar;
