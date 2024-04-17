import React from "react";
import Stats from "../components/DashBoardComponents/Stats";
import ReviewList from "../components/DashBoardComponents/ReviewList";
import MyNotes from "../components/DashBoardComponents/MyNotes";
import "../css/DashBoard.css";
import Connections from "../components/Connections";
function DashBoard() {
  return (
    <div className="dashBoardPage">
      <div className="dashboard">
        <Stats />
        <MyNotes />
        <ReviewList />
      </div>
      <Connections />
    </div>
  );
}

export default DashBoard;
