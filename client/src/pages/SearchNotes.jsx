import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import "../css/Search.css";

function SearchNotes() {
  return (
    <div className="searchNote">
      <div className="searchBarContainer">
        <input className="searchBar" type="search" name="" id="" />
        <div className="searchIconContainer">
          <SearchIcon
            className="searchIcon"
            fontSize="large"
            style={{
              color: "#0099ff",
            }}
          />
        </div>
      </div>

      <div className="searchNotesResultContainer"></div>
    </div>
  );
}

export default SearchNotes;