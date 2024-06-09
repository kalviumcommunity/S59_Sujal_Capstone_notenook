import { useParams } from "react-router-dom";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import axios from "axios";
import pic from "../../assets/pic.png";

function ViewUserInfo({ userInfo, setUserInfo }) {
  const { userId } = useParams();

  const handleFriendRequest = async (action) => {
    const token = extractTokenFromCookie();
    if (!token) {
      return;
    }

    let apiURI = "";
    let method = "";
    let data = {};

    switch (action) {
      case "send":
        apiURI = import.meta.env.VITE_REACT_APP_SEND_FRIEND_REQUEST_ENDPOINT;
        method = "post";
        data = { receiverId: userId };
        break;
      case "unsend":
        apiURI = import.meta.env.VITE_REACT_APP_UNSEND_FRIEND_REQUEST_ENDPOINT;
        method = "delete";
        data = { receiverId: userId };
        break;
      case "accept":
        apiURI = `${
          import.meta.env.VITE_REACT_APP_ACCEPT_FRIEND_REQUEST_ENDPOINT
        }/${userInfo.requestId}`;
        method = "post";
        data = { senderId: userId };
        break;
      case "reject":
        apiURI = `${
          import.meta.env.VITE_REACT_APP_REJECT_FRIEND_REQUEST_ENDPOINT
        }/${userInfo.requestId}`;
        method = "post";
        data = { senderId: userId };
        break;
      case "remove":
        apiURI = import.meta.env.VITE_REACT_APP_REMOVE_FRIEND_ENDPOINT;
        method = "post";
        data = { friendId: userId };
        break;
      default:
        return;
    }

    try {
      const response = await axios({
        method: method,
        url: apiURI,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: data,
      });

      setUserInfo((prevState) => {
        let newStatus = prevState.friendshipStatus;

        if (action === "send") newStatus = "pending";
        if (action === "unsend" || action === "reject" || action === "remove")
          newStatus = "none";
        if (action === "accept") newStatus = "friends";

        return { ...prevState, friendshipStatus: newStatus };
      });
    } catch (error) {
      console.error(`Error handling friend request (${action}):`, error);
    }
  };

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
            <div className="friendshipButtons">
              {userInfo.friendshipStatus === "none" && (
                <button
                  className="addFriend button"
                  onClick={() => handleFriendRequest("send")}
                >
                  Add Friend
                </button>
              )}
              {userInfo.friendshipStatus === "pending" && (
                <button
                  className="addFriend button"
                  onClick={() => handleFriendRequest("unsend")}
                >
                  Cancel Request
                </button>
              )}
              {userInfo.friendshipStatus === "incoming" && (
                <>
                  <button
                    className="acceptFriend button"
                    onClick={() => handleFriendRequest("accept")}
                  >
                    Accept
                  </button>
                  <button
                    className="rejectFriend button"
                    onClick={() => handleFriendRequest("reject")}
                  >
                    Reject
                  </button>
                </>
              )}
              {userInfo.friendshipStatus === "friends" && (
                <button
                  className="removeFriend button"
                  onClick={() => handleFriendRequest("remove")}
                >
                  Remove Friend
                </button>
              )}
            </div>

            <br />
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewUserInfo;
