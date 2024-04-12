import React from "react";
import Stats from "../components/DashBoardComponents/Stats";
import ReviewList from "../components/DashBoardComponents/ReviewList";
import MyNotes from "../components/DashBoardComponents/MyNotes";

function DashBoard() {
  return (
    <div className="dashboard">
      <div>
        <Stats />
        <ReviewList />
      </div>
      <MyNotes></MyNotes>
    </div>
  );
}

export default DashBoard;
