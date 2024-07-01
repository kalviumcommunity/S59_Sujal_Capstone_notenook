import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { UserContext } from "../context/userContext";
import logo from "../assets/logo.svg";
import pic from "../assets/pic.png";
import "../css/Header.css";
import Notifications from "./NotificationComponents/Notifications";
import "../css/Notifications.css";
import "../css/Tabs.css";

function Header() {
  return (
    <div className="fixed top-0 left-0 w-screen flex justify-between items-center py-4 pl-4 pr-8 h-20 md:h-28 header">
      <Link to="/">
        <img src={logo} alt="Logo" className="logo h-16 md:h-20 " />
      </Link>
      <UserInfo />
    </div>
  );
}

function UserInfo() {
  const { user } = useContext(UserContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const style = {
    color: "#0099ff",
  };

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
    <div className="flex header gap-3 justify-between items-center">
      <Link to="/notenook/postnotes">
        <AddCircleIcon className="headerIcon" style={style} fontSize="medium" />
      </Link>

      <div className="relative">
        <EmojiEmotionsIcon
          className="headerIcon"
          style={style}
          fontSize="medium"
          onClick={handleIconClick}
        />
        {showNotifications && (
          <div
            className={`notificationsContainer ${
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

      <Link
        to={"/notenook/profile"}
        className="flex gap-3 justify-between items-center"
      >
        <div className="w-0.5 h-5 bg-gray-400"></div>
        <img src={pic} alt="Profile" className="h-8 md:h-10 w-auto" />
        <p className="text-sm md:text-base max-w-[60px] overflow-hidden whitespace-nowrap text-ellipsis">
          {user?.username}
        </p>{" "}
      </Link>
    </div>
  );
}

export default Header;
