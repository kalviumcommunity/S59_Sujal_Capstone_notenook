import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import "../css/Search.css";
import NoteList from "../components/NoteList";
import SearchResult from "../components/SearchResult";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useContext } from "react";
import { DeviceWidthContext } from "../context/deviceWidthContext";
function SearchNotes() {
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);
  const width = useContext(DeviceWidthContext);

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const searchInput = event.target.elements.searchInput.value;
      const tokenCookie = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("token="));

      if (tokenCookie) {
        const token = tokenCookie.split("=")[1];
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_SEARCH_NOTE_ENDPOINT
          }?searchInput=${searchInput}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setSearchResults(response.data.notes);
        setError(null);
      }
    } catch (error) {
      console.error("Error searching notes:", error);
      setError("An error occurred while searching notes. Please try again.");
    }
  };

  return (
    <div className="searchNotesPage">
      <div className="searchNote">
        <form className="searchBarContainer" onSubmit={handleSearch}>
          <input
            className="searchBar"
            type="search"
            name="searchInput"
            id="searchInput"
          />
          <button type="submit" className="searchIconContainer">
            <SearchIcon
              className="searchIcon"
              fontSize="large"
              style={{
                color: "#0099ff",
              }}
            />
          </button>
        </form>

        <div className="searchNotesResultContainer">
          {error && <p className="error">{error}</p>}{" "}
          {searchResults && searchResults.length === 0 && (
            <p className="placeHolder">No results found</p>
          )}
          {searchResults &&
            searchResults.map((result) => {
              return <SearchResult key={uuidv4()} result={result} />;
            })}
        </div>
      </div>
      {width > 1024 && <NoteList />}
    </div>
  );
}

export default SearchNotes;
