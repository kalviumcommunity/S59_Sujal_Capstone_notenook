import { Link } from "react-router-dom";
import pic from "../../assets/pic.png";
function UserToChat({ user }) {
  return (
    <Link to={`${user.id}`}>
      <div className="connection userToChat">
        <div className="connectionInfo">
          <img className="connectionPic" src={pic} alt="" />
          <p className="connectionUsername">{user.username}</p>
        </div>
      </div>
    </Link>
  );
}

export default UserToChat;
