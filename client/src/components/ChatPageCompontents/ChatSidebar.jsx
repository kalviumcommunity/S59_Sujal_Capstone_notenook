import React, { useEffect, useState } from "react";
import axios from "axios";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import UserToChat from "./UserToChat";
import SearchIcon from "@mui/icons-material/Search"; 


const ChatSidebar = () => {
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const token = extractTokenFromCookie();
    if (!token) {
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_REACT_APP_GETCHATS_ENDPOINT,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching users for chat:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSearch = () => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="chat-sidebar">
      <div className="friendSearchBarContainer">
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

      <ul className="chat-list">
        {filteredUsers &&
          filteredUsers.map((user) => (
            <UserToChat key={user.id} user={user} />
          ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
