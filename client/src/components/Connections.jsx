import React from "react";
import "../css/Connections.css";
import pic from "../assets/pic.png";
import SmsIcon from "@mui/icons-material/Sms";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
function Connections() {
  console.log("Connetion rerenederd");
  const { user } = useContext(AuthContext);
  const friends = user.friends;
  return (
    <div className="p-4 connectionsDiv relative">
      {!friends && (
        <p className="placeHolder">Your Top connections Appear here</p>
      )}

      <h1 className="heading">Connections</h1>

      <div className="connectionList">
        {friends &&
          friends.map((friend, i) => (
            <Connection key={i} username={friend.username} />
          ))}
      </div>
    </div>
  );
}

function Connection({ username }) {
  return (
    <div className="connection">
      <div className="connectionInfo">
        <img className="connectionPic" src={pic} alt="" />
        <p className="connectionUsername">{username}</p>
      </div>
      <SmsIcon fontSize="small" color="primary" />
    </div>
  );
}
export default Connections;
