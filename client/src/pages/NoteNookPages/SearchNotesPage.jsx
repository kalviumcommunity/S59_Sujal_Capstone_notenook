import { useState, useContext } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

import { IoIosSearch } from "react-icons/io";

import { DeviceWidthContext } from "../../context/deviceWidthContext";

import NoteList from "../../components/NoteLists/NoteList";
import NoteResult from "../../components/NoteCards/NoteResult";
import Loader from "../../components/Loaders/Loader";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

function SearchNotesPage() {
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchingNotes, setSearchingNotes] = useState(false);

  const width = useContext(DeviceWidthContext);

  const handleSearch = async () => {
    if (searchInput === "") {
      return;
    }
    setSearchResults(null);
    setSearchingNotes(true);
    try {
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
    } finally {
      setSearchingNotes(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="searchNotesPage page css scrollHidden grid grid-cols-1 lg:grid-cols-[1fr_325px] gap-4">
      <div className="searchNote page css flex flex-col items-center gap-6">
        <div className="flex w-full max-w-sm items-center space-x-2 min-h-fit h-[5%]">
          <Input
            type="text"
            placeholder="Search for notes..."
            className="text-black"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button type="button" onClick={handleSearch}>
            <IoIosSearch className="text-2xl" />
          </Button>
        </div>

        <div className="p-4 relative w-full max-w-[90vw] h-[95%] overflow-y-scroll grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(260px,400px))] justify-center gap-10 gap-y-0 auto-rows-min">
          {searchingNotes && <Loader action={"Searching For Notes..."} />}
          {error && !searchingNotes && (
            <p className="absolute top-[40%] left-[50%] -translate-x-[50%] -translate-y-[40%] text-base text-red-500 font-bold text-centeror">
              {error}
            </p>
          )}
          {searchResults && searchResults.length === 0 && (
            <p className="absolute top-[40%] left-[50%] -translate-x-[50%] -translate-y-[40%] text-sm text-neutral-300 text-center">
              No results found
            </p>
          )}
          {!searchResults && !error && !searchingNotes && (
            <p className="absolute top-[40%] left-[50%] -translate-x-[50%] -translate-y-[40%] text-sm text-neutral-300 text-center z-0">
              Search notes based on Title or Subject
            </p>
          )}
          {searchResults &&
            searchResults.map((result) => {
              return <NoteResult key={uuidv4()} result={result} />;
            })}
        </div>
      </div>
      {width > 1024 && <NoteList />}
    </div>
  );
}

export default SearchNotesPage;
