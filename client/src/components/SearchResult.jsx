import React from "react";
import pic from "../assets/pic.png";

function SearchResult({ result }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="searchNoteResult">
      <div className="resultInfo">
        <p className="postedBy">
          <img src={pic} alt="" cla />
          <span>{result.postedBy.username}</span>
        </p>
        <p className="title">
          <span className="lable">Title: </span>
          {result.title}
        </p>
        <p className="subject">
          <span className="lable">Subject: </span>
          {result.subject}
        </p>
        <p className="updatedAt">Posted {formatDate(result.updatedAt)}</p>
        <button className="view button">View</button>
      </div>
    </div>
  );
}

export default SearchResult;
