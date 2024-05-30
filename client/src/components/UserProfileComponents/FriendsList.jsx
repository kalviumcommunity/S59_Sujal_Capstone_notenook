import { Link } from "react-router-dom";
import SmsIcon from "@mui/icons-material/Sms";

import "../../css/Connections.css";
import pic from "../../assets/pic.png";

function FriendsList({ friends }) {
  return (
    <div className="p-4 profileFriendList">
      {!friends && <p className="placeHolder">Your Friendlist appears here</p>}

      <div className="connectionList">
        {friends &&
          friends.map((friend, i) => <Friend key={i} friend={friend} />)}
      </div>
    </div>
  );
}

function Friend({ friend }) {
  return (
    <div className="connection">
      <Link to={`/notenook/viewUser/${friend._id}`}>
        <div className="connectionInfo">
          <img className="connectionPic" src={pic} alt="" />
          <p className="connectionUsername">{friend.username}</p>
        </div>
      </Link>

      <Link to={`/notenook/viewUser/${friend._id}`}>
        <button className="button viewProfile">Profile</button>
      </Link>
    </div>
  );
}
export default FriendsList;
