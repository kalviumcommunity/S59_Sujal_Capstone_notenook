import RefreshIcon from "@mui/icons-material/Refresh";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import { UserContext } from "../../context/userContext";
import FriendNotification from "./FriendNotification";
import NoteNotification from "./NoteNotification";

function Notifications() {
  const { user, setUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("friends");
  const [friendNotifications, setFriendNotifications] = useState([]);
  const [postNotifications, setPostNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = extractTokenFromCookie();
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_GET_NOTIFICATIONS_ULR,
        {
          withCredentials: true,
          headers: {
            Authorization: `bearer ${token || null}`,
          },
        }
      );

      if (response.status === 200) {
        const { userNotifications, postNotifications } = response.data;
        setFriendNotifications(userNotifications);
        setPostNotifications(postNotifications);
        setUser((prevUser) => ({
          ...prevUser,
          notifications: {
            userNotifications,
            postNotifications,
          },
        }));
      } else {
        setError("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.notifications) {
      fetchNotifications();
    } else {
      setFriendNotifications(user.notifications.userNotifications);
      setPostNotifications(user.notifications.postNotifications);
    }
  }, [user, setUser]);

  const handleRefresh = () => {
    fetchNotifications();
  };

  const renderContent = () => {
    if (loading) {
      return <CircularProgress />;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return activeTab === "friends"
      ? friendNotifications.map((notification, index) => (
          <FriendNotification key={index} notification={notification} />
        ))
      : postNotifications.map((notification, index) => (
          <NoteNotification key={index} notification={notification} />
        ));
  };

  return (
    <div className="notifications-container">
      <button className="button block ml-auto mt-4" onClick={handleRefresh}>
        {loading ? <CircularProgress size={16} /> : <RefreshIcon fontSize="small"/>}
      </button>

      <div className="tabs">
        <div
          className={`tab ${activeTab === "friends" ? "active" : ""}`}
          onClick={() => setActiveTab("friends")}
        >
          Friends
        </div>
        <div
          className={`tab ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          Notes
        </div>
      </div>

      <div className="notifications">{renderContent()}</div>
    </div>
  );
}

export default Notifications;
