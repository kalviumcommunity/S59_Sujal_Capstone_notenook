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
      <div className="flex flex-col gap-10">
        <NavLink
          className="dashBoardIcon navButton"
          to="/dashboard"
          activeClassName="active"
        >
          <DashboardIcon style={style} fontSize="small" />
        </NavLink>

        <NavLink
          className="noteIcon navButton"
          to="/dashboard/notes"
          activeClassName="active"
        >
          <EventNoteIcon style={style} />
        </NavLink>

        <NavLink
          className="addIcon navButton"
          to="/dashboard/add"
          activeClassName="active"
        >
          <AddCircleIcon style={style} />
        </NavLink>

        <NavLink
          className="friendsIcon navButton"
          to="/dashboard/friends"
          activeClassName="active"
        >
          <PeopleAltIcon style={style} />
        </NavLink>

        <NavLink
          className="chatIcon navButton"
          to="/dashboard/chat"
          activeClassName="active"
        >
          <ChatBubbleIcon style={style} />
        </NavLink>
      </div>
    </div>
  );
}

export default NavBar;
