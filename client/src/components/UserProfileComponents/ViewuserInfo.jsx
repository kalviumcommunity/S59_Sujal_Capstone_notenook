import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import axios from "axios";
import pic from "../../assets/pic.png";
function ViewUserInfo() {
  const [userInfo, setUserInfo] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = extractTokenFromCookie();
      if (!token) {
        return;
      }
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_GET_USER_DETAIL_ENDPOINT
          }/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        setUserInfo(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <div className="userInfoComponent relative">
        <br />
        {userInfo && (
          <div className="user-info">
            <div className="user-details">
              <div className="flex items-center">
                <img src={pic} alt="Profile" className="profile-pic" />
                <div className="user-text">
                  <div className="username-container">
                    <h2 className="username">{userInfo.username}</h2>
                    <p className="fullname">{userInfo.fullname}</p>
                  </div>

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
            </div>
            <br />
            <button className="addFriend button">Add Friend</button>
            <br />
            <hr className="hrLine" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewUserInfo;
