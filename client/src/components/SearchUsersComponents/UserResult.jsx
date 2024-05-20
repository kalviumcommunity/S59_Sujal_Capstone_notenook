import pic from "../../assets/pic.png";
import { Link } from "react-router-dom";
function UserResult({ user }) {
  return (
    <div className="searchUserResult">
      <div className="userResult">
        <Link to={`/notenook/viewUser/${user._id}`}>
          <div className="userInfo">
            <img src={pic} alt={`${user.username}'s profile picture`} />
            <div className="userDetail">
              <p className="username">{user.username}</p>
              <p className="fullname">{user.fullname}</p>
            </div>
          </div>
        </Link>

        <button className="addFriend button">Add Friend</button>
      </div>
    </div>
  );
}

export default UserResult;
