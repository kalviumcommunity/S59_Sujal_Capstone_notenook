import { useContext } from "react";

import { DeviceWidthContext } from "../../context/deviceWidthContext";

import Stats from "../../components/DashBoardComponents/Stats";
import DashboardReviewList from "../../components/DashBoardComponents/DashboardReviewList";
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
        <DashboardReviewList />
      </div>
      {width > 1200 && <Connections />}
    </div>
  );
}

export default DashBoard;
