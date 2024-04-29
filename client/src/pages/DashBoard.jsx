import React from "react";
import Stats from "../components/DashBoardComponents/Stats";
import ReviewList from "../components/DashBoardComponents/ReviewList";
import NoteList from "../components/NoteList";
import "../css/DashBoard.css";
import { useContext } from "react";
import Connections from "../components/Connections";
import { DeviceWidthContext } from "../context/deviceWidthContext";
function DashBoard() {
  const width = useContext(DeviceWidthContext);

  return (
    <div className="dashBoardPage">
      <div className="dashboard">
        <Stats />
        <NoteList />
        <ReviewList />
      </div>
      {width > 1024 && <Connections />}
    </div>
  );
}

export default DashBoard;
