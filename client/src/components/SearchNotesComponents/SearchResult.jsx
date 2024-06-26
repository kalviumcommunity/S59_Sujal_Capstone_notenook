import React from "react";
import pic from "../../assets/pic.png";
import formatDate from "../../Functions/FormatDate";
import { Link } from "react-router-dom";
function SearchResult({ result }) {
  return (
    <div className="searchNoteResult">
      <div className="resultInfo">
        <Link to={`/notenook/viewUser/${result.postedBy._id}`}>
          <p className="postedBy">
            <img
              src={pic}
              alt={`${result.postedBy.username}'s profile picture`}
            />
            <span>{result.postedBy.username}</span>
          </p>
        </Link>

        <p className="title">
          <span className="lable">Title: </span>
          {result.title}
        </p>
        <p className="subject">
          <span className="lable">Subject: </span>
          {result.subject}
        </p>
        <p className="updatedAt">Posted {formatDate(result.updatedAt)}</p>
        <Link to={`/notenook/viewNote/${result.note}`}>
          <button className="view button">View</button>
        </Link>
      </div>
    </div>
  );
}

export default SearchResult;
