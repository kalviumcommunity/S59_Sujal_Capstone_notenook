import React, { useContext } from "react";
import logo from "../assets/logo.jpeg";
import pic from "../assets/pic.png";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="flex justify-between items-center py-4 pl-4 pr-8">
      <Link to="/">
        <img src={logo} alt="" className="h-20 md:h-24 w-auto" />
      </Link>

      <UserInfo />
    </div>
  );
}

function UserInfo() {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex gap-3 justify-between items-center">
      <img src={pic} alt="" className="h-12 md:h-16 w-auto" />
      <p>{user.username}</p>
    </div>
  );
}

export default Header;
