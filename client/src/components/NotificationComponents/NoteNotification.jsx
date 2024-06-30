import { Link } from "react-router-dom";
import pic from "../../assets/pic.png";
import formatDate from "../../Functions/FormatDate";

const NoteNotification = ({ notification }) => {
  return (
    <div className="notification">
      <Link to={`/notenook/viewUser/${notification.relatedUser?._id}`}>
        <div className="info">
          <img src={pic} alt="User avatar" className="avatar" />
          <div>
            <p className="username">{notification.relatedUser?.username}</p>
            <p className="updatedDate">{formatDate(notification.createdAt)}</p>
          </div>
        </div>
      </Link>
      <div className="notificationMessage">
        <p>{notification.message}</p>
      </div>
      <p className="notificationMessage">
        commented on:{" "}
        <span className="font-bold text-green-600">
          <Link to={`/notenook/viewNote/${notification.relatedPost?._id}`}>
            {notification.relatedPost?.title}
          </Link>
        </span>
      </p>
    </div>
  );
};

export default NoteNotification;
