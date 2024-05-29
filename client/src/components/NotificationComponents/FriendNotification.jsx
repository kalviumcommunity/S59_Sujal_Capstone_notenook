import pic from "../../assets/pic.png";
import formatDate from "../../Functions/FormatDate";
import { Link } from "react-router-dom";

const FriendNotification = ({ notification }) => {
  return (
    <div className="notification">
      <Link to={`/notenook/viewUser/${notification.relatedUser?._id}`}>
        <div className="info">
          <img src={pic} alt="User avatar" className="avatar" />
          <div className="message">
            <p className="username">{notification.relatedUser.username}</p>
            <p className="updatedDate">{formatDate(notification.createdAt)}</p>
          </div>
        </div>
      </Link>

      <div className="message">{notification.message}</div>
      <div className="buttons">
        <Link
          to={`/notenook/viewUser/${notification.relatedUser?._id}`}
          className="addFriend"
        >
          <button className="addFriend button">View Profile</button>
        </Link>
      </div>
    </div>
  );
};

export default FriendNotification;
