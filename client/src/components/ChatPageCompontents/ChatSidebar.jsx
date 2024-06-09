import React, { useEffect, useState } from "react";
import UserToChat from "./UserToChat";
import { useLocation, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

const ChatSidebar = ({ users, selectedUser, friends, setSelectedUser }) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
  };

  const handleSearch = () => {
    const filtered = friends.filter((friend) =>
      friend.username.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    navigate(`${user._id}`);
  };

  useEffect(() => {
    if (searchInput.length) {
      const filtered = friends.filter((friend) => {
        return friend.username
          .toLowerCase()
          .includes(searchInput.toLowerCase());
      });
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchInput]);

  useEffect(() => {
    setFilteredUsers(users);
    if (selectedUser) {
      setFilteredUsers((prevUsers) => {
        const userIndex = prevUsers.findIndex(
          (user) => user._id === selectedUser._id
        );
        if (userIndex === -1) {
          return [selectedUser, ...prevUsers];
        }
        return prevUsers;
      });
    }
  }, [users]);

  useEffect(() => {
    setSearchInput("");
  }, [location]);

  return (
    <div className="chat-sidebar">
      <div className="friendSearchBarContainer">
        <input
          className="searchBar"
          type="search"
          value={searchInput}
          onChange={handleInputChange}
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
        {filteredUsers.map((user) => (
          <UserToChat
            key={user._id}
            user={user}
            isSelected={selectedUser && user._id === selectedUser._id}
            onUserClick={handleUserClick}
          />
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
