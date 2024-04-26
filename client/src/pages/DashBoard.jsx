import React from "react";
import Stats from "../components/DashBoardComponents/Stats";
import ReviewList from "../components/DashBoardComponents/ReviewList";
import NoteList from "../components/DashBoardComponents/NoteList";
import "../css/DashBoard.css";
import Connections from "../components/Connections";

function DashBoard() {
  return (
    <div className="dashBoardPage">
      <div className="dashboard">
        <Stats />
        <NoteList />
        <ReviewList />
      </div>
      <Connections />
    </div>
  );
}

export default DashBoard;
