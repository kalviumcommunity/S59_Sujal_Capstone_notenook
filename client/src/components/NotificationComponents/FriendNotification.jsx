import pic from "../../assets/pic.png";
import formatDate from "../../Functions/FormatDate";

const FriendNotification = ({ username, message, date }) => {
  return (
    <div className="notification">
      <div className="info">
        <img src={pic} alt="User avatar" className="avatar" />
        <div className="message">
          <p className="username">{username}</p>
          <p className="updatedDate">{formatDate(date)}</p>
        </div>
      </div>
      <div className="message">{message}</div>
      <div className="buttons">
        <button className="button reject">Reject</button>
        <button className="button accept">Accept</button>
      </div>
    </div>
  );
};

export default FriendNotification;
