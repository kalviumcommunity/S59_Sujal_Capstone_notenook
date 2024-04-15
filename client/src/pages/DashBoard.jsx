import React from "react";
import Stats from "../components/DashBoardComponents/Stats";
import ReviewList from "../components/DashBoardComponents/ReviewList";
import MyNotes from "../components/DashBoardComponents/MyNotes";
import Connections from "../components/Connections";

function DashBoard() {
  return (
    <div className="dashboard">
      <Stats />
      <MyNotes />
      <ReviewList />
    </div>
  );
}

export default DashBoard;
