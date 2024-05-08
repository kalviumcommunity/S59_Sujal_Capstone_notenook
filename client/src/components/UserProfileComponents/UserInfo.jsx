import React, { useState } from "react";
import pic from "../../assets/pic.png";
import { Link } from "react-router-dom";
function UserInfo() {
  const [userInfo, setUserInfo] = useState({
    username: "shresu",
    fullname: "Sujal Shrestha",
    email: "sujshrest@gmail.com",
    numberOfNotes: 6,
    numberOfConnections: 0,
  });

  return (
    <div className="userInfoComponent">
      <br />
      {userInfo && (
        <div className="user-info">
          <div className="user-details">
            <div className="flex items-center">
              <img src={pic} alt="Profile" className="profile-pic" />

              <div className="user-text">
                <Link to={""}>
                  <div className="username-container">
                    <h2 className="username">{userInfo.username}</h2>
                    <p className="fullname">{userInfo.fullname}</p>
                  </div>
                </Link>
                <div className="user-stats">
                  <p className="notes">
                    Notes: <span>{userInfo.numberOfNotes}</span>
                  </p>
                  <p className="connections">
                    Connections: <span>{userInfo.numberOfConnections}</span>
                  </p>
                </div>
              </div>
            </div>
            <Link to={"edit"}>
              <button className="edit button">Edit</button>
            </Link>
          </div>
          <br />
          <button className="logout button">Log Out</button>
          <br />
          <hr className="hrLine" />
        </div>
      )}
    </div>
  );
}

export default UserInfo;
