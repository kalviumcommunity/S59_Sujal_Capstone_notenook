import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";

import RegistrationForm from "../components/UserForms/RegistrationForm";
import LoginForm from "../components/UserForms/LoginForm";
import OTPVerificationForm from "../components/UserForms/OTPVerificationForm"; 

import logo from "../assets/logo.png";

function Forms() {
  const [userData, setUserData] = useState(null);

  return (
    <div className="overflow-x-hidden">
      <div className="flex w-screen justify-between items-center py-4 p-8">
        <Link to="/">
          <img src={logo} alt="" className="logo h-16 md:h-20 " />
        </Link>

        <div className="flex justify-between items-center">
          <Link to={"/"}>
            <button className="button" role="button">
              Home
            </button>
          </Link>
        </div>
      </div>

      <div className="min-height-60 flex flex-col xl:flex-row px-8 items-center justify-center xl:justify-around">
        <div className="min-height-50 flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl xl:text-5xl font-bold mb-6">
            Welcome to notenook!
          </h1>
          <h1 className="text-2xl xl:text-4xl font-bold my-4">
            Share Notes, Connect, and Grow.
          </h1>
          <h2 className="text-lg md:text-xl my-4">
            Organize your thoughts, connect with others, and learn together.
          </h2>
        </div>

        <div>
          <Routes>
            <Route
              path="/registration"
              element={<RegistrationForm setUserData={setUserData} />}
            />
            <Route
              path="/login"
              element={<LoginForm setUserData={setUserData} />}
            />
            <Route
              path="/verification"
              element={<OTPVerificationForm userData={userData} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Forms;
