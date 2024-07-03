import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import Notifications from "../NotificationComponents/Notifications";
import "../../css/Notifications.css";
import "../../css/Tabs.css";

const HeaderNotifications = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleIconClick = () => {
    setShowNotifications((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      notificationsRef.current &&
      !notificationsRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }
  };

  const handleSeeAllClick = () => {
    setShowNotifications(false);
    navigate("notifications");
  };

  useEffect(() => {
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  useEffect(() => {
    setShowNotifications(false);
  }, [location]);

  return (
    <div className="flex flex-col items-center absolute -left-12 top-[50%] -translate-y-[50%]">
      <div className="relative">
        <IoNotificationsCircleOutline
          className="text-3xl"
          onClick={handleIconClick}
        />
      </div>
      {showNotifications && (
        <div
          className={`absolute top-[100%] notificationsContainer ${
            showNotifications ? "visible" : "invisible"
          }`}
          ref={notificationsRef}
        >
          <div className="flex w-full justify-between">
            <h2 className="heading">Notifications</h2>
            <button className="button" onClick={handleSeeAllClick}>
              See All
            </button>
          </div>
          <Notifications />
        </div>
      )}
    </div>
  );
};

export default HeaderNotifications;
