import React from "react";
import logo from "../assets/logo.jpeg";
import "../css/Loader.css";

function Loader() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <img src={logo} alt="logo" className="w-28 md:w-36 mb-12" />
      <div className="loader w-16 md:w-20" aria-label="Loading"></div>
    </div>
  );
}

export default Loader;
