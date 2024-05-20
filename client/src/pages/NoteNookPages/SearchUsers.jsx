import { useState, useContext } from "react";

import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";

import { DeviceWidthContext } from "../../context/deviceWidthContext";
import Connections from "../../components/Connections";
import UserResult from "../../components/SearchUsersComponents/UserResult";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import "../../css/Search.css";


function SearchUsers() {
  const width = useContext(DeviceWidthContext);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    const token = extractTokenFromCookie();
    if (token) {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_SEARCH_USERS_ENDPOINT
          }?searchInput=${searchInput}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setSearchResults(response.data.users);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="searchUsersPage">
      <div className="searchUser">
        <div className="searchBarContainer">
          <input
            className="searchBar"
            type="search"
            value={searchInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />
          <div className="searchIconContainer" onClick={handleSearch}>
            <SearchIcon
              className="searchIcon"
              fontSize="large"
              style={{ color: "#0099ff" }}
            />
          </div>
        </div>
        <div className="searchUsersResultContainer">
          {searchResults.map((user) => (
            <UserResult user={user} key={user._id}/>
          ))}
        </div>
      </div>
      {width >= 1200 && <Connections />}
    </div>
  );
}

export default SearchUsers;
