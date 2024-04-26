import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import "../css/Search.css";
import MyNotes from "../components/DashBoardComponents/MyNotes";
import SearchResult from "../components/SearchResult";

function SearchNotes() {
  const [searchResults, setSearchResults] = useState(null);

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

        <div className="searchNotesResultContainer">
          {searchResults &&
            searchResults.map((result) => {
              return <SearchResult result={result} />;
            })}
        </div>
      </div>

      <MyNotes />
    </div>
  );
}

export default SearchNotes;
