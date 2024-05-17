import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; // Import axios

import pic from "../../assets/pic.png";

function UserInfo({ userInfo }) {
  const [logoutConfirmation, setLogoutConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8080/auth/google/logout", {
        withCredentials: true,
      });
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/forms/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="userInfoComponent relative">
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
          <button
            className="logout button"
            onClick={() => setLogoutConfirmation(true)}
          >
            Log Out
          </button>
          <br />
          <hr className="hrLine" />
        </div>
      )}
      {logoutConfirmation && (
        <div className="confirmation-popup">
          <p className="heading">Are you sure you want to log out?</p>
          <div className="flex gap-10">
            <button onClick={handleLogout} className="button yes-button">
              Yes
            </button>
            <button
              onClick={() => setLogoutConfirmation(false)}
              className="button cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserInfo;
