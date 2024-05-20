import pic from "../../assets/pic.png";
import formatDate from "../../Functions/FormatDate";

const NoteNotification = ({ username, message, note, date }) => {
  return (
    <div className="notification">
      <div className="info">
        <img src={pic} alt="User avatar" className="avatar" />
        <div className="message">
          <p className="username">{username}</p>
          <p className="updatedDate">{formatDate(date)}</p>
        </div>
      </div>
      <div className="message">
        {message} <strong>{note}</strong>
      </div>
    </div>
  );
};

export default NoteNotification;
