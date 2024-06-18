import React from "react";
import ReviewList from "../AddNotesComponent/ReviewList";

function DashboardReviewList() {
  return (
    <div className="dashBoardComponent reviewList relative">
      <h1 className="heading">My review List</h1>
      <div className="reviewListContainer">
        <ReviewList />
      </div>
    </div>
  );
}

export default DashboardReviewList;
