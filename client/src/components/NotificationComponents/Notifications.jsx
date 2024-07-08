import { useContext, useEffect, useState } from "react";
import axios from "axios";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import { IoRefreshCircleOutline } from "react-icons/io5";
import { UserContext } from "../../context/userContext";

import SendingLoader from "../Loaders/SendingLoader";
import FriendNotification from "./FriendNotification";
import NoteNotification from "./NoteNotification";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

function Notifications() {
  const { user, setUser } = useContext(UserContext);
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

  return (
    <Tabs
      defaultValue="friends"
      className="w-full mt-4 h-[calc(100%-3rem)] flex flex-col scrollHidden"
    >
      <div className="flex justify-between items-center h-[40px] mb-4">
        <TabsList>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="post">Post</TabsTrigger>
        </TabsList>
        <div>
          {loading ? (
            <SendingLoader />
          ) : (
            <button onClick={handleRefresh}>
              <IoRefreshCircleOutline className="text-3xl" />
            </button>
          )}
        </div>
      </div>

      <div className="h-[calc(100%-40px)] overflow-y-scroll w-full pr-2">
        <TabsContent value="friends">
          {friendNotifications.map((notification, index) => (
            <FriendNotification key={index} notification={notification} />
          ))}
        </TabsContent>
        <TabsContent value="post">
          {postNotifications.map((notification, index) => (
            <NoteNotification key={index} notification={notification} />
          ))}
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default Notifications;
