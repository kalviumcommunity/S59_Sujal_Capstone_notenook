import React from "react";
import { Link } from "react-router-dom";
import pic from "../../assets/pic.png";

const UserToChat = ({ user, isSelected }) => {
  return (
    <Link to={user.id}>
      <li
        className={`connection userToChat ${isSelected ? "selected" : ""}`}
      >
        <div className="connectionInfo">
          <img className="connectionPic" src={pic} alt={user.username} />
          <p className="connectionUsername">{user.username}</p>
        </div>
      </li>
    </Link>
  );
};

export default UserToChat;
