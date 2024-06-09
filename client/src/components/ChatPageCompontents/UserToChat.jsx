import React from "react";
import pic from "../../assets/pic.png";

const UserToChat = ({ user, isSelected, onUserClick }) => {
  const handleClick = () => {
    onUserClick(user);
  };

  return (
    <li
      className={`connection userToChat ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
    >
      <div className="connectionInfo">
        <img className="connectionPic" src={pic} alt={user.username} />
        <p className="connectionUsername">{user.username}</p>
      </div>
    </li>
  );
};

export default UserToChat;
