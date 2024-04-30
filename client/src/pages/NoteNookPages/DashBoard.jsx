import { useContext } from "react";

import { DeviceWidthContext } from "../../context/deviceWidthContext";

import Stats from "../../components/DashBoardComponents/Stats";
import ReviewList from "../../components/DashBoardComponents/ReviewList";
import NoteList from "../../components/NoteList";
import Connections from "../../components/Connections";

import "../../css/DashBoard.css";

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
