import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import "../css/Search.css";
import MyNotes from "../components/DashBoardComponents/MyNotes";
function SearchNotes() {
  return (
    <div className="searchNotesPage">
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

      <MyNotes />
    </div>
  );
}

export default SearchNotes;
