import pic from "../../assets/pic.png";
import formatDate from "../../Functions/FormatDate";
import { Link } from "react-router-dom";
const NoteNotification = ({ notification }) => {
  return (
    <div className="notification">
      <Link to={`/notenook/viewUser/${notification.user?._id}`}>
        <div className="info">
          <img src={pic} alt="User avatar" className="avatar" />
          <div className="message">
            <p className="username">{notification.username}</p>
            <p className="updatedDate">{formatDate(notification.date)}</p>
          </div>
        </div>
      </Link>
      <div className="message">
        <p>
          {notification.message}
          <Link to={`/notenook/viewNote/${notification.note?._id}`}>
            {notification.note?.name}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NoteNotification;
