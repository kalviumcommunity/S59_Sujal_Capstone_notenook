import { useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";

import { DeviceWidthContext } from "../../context/deviceWidthContext";

import NoteList from "../../components/NoteList";
import SearchResult from "../../components/SearchNotesComponents/SearchResult";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

import "../../css/Search.css";

function SearchNotes() {
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);
  const width = useContext(DeviceWidthContext);

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const searchInput = event.target.elements.searchInput.value;
      const token = extractTokenFromCookie();
      if (token) {
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
