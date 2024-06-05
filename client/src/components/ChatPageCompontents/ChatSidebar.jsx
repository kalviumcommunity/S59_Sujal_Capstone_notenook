import React, { useEffect, useState } from "react";
import UserToChat from "./UserToChat";
import SearchIcon from "@mui/icons-material/Search";

const ChatSidebar = ({ users, selectedUser, topUser }) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

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

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

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
        {topUser && (
          <UserToChat
            user={topUser}
            isSelected={selectedUser && topUser.id === selectedUser.id}
          />
        )}
        {filteredUsers.map((user) =>
          topUser?.id != user.id ? (
            <UserToChat
              key={user.id}
              user={user}
              onClick={() => handleUserSelect(user)}
              isSelected={selectedUser && user.id === selectedUser.id}
            />
          ) : null
        )}
      </ul>
    </div>
  );
};

export default ChatSidebar;
