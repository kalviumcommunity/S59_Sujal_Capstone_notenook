import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
function NoteNook() {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user.isLoggedIn) {
      navigate("/forms/login");
    }
  });

  return (
    <div>
      <Header />
      <NavBar />
    </div>
  );
}

export default NoteNook;
