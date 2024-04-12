import React, { useContext } from "react";
import logo from "../assets/logo.jpeg";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function HomePage() {
  return (
    <div>
      <div className="flex w-screen justify-between items-center py-4 pl-2 pr-8">
        <Link to="/">
          <img src={logo} alt="" className="logo h-16 md:h-20 " />
        </Link>

        <div className="flex w-52 justify-between items-center">
          <HomePageButtons />
        </div>
      </div>

      <div className="min-height-50 flex flex-col items-center justify-center text-center px-8">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Welcome to notenook!!!
        </h1>
        <h1 className="text-2xl md:text-4xl font-bold my-4">
          If You Aren't Taking Notes, You Aren't Learning.
        </h1>
        <h2 className="text-lg md:text-xl my-4">
          Take notes. Connect. Share. Grow.
        </h2>
        <button className="button md:ml-0">Get Started</button>
      </div>
    </div>
  );
}

function HomePageButtons() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user.username ? (
        <>
          <Link to="/notenook/dashboard">
            <button className="button" role="button">
              Dashboard
            </button>
          </Link>
          <Link to="notenook/profile">
            <button className="button" role="button">
              Profile
            </button>
          </Link>
        </>
      ) : (
        <>
          <Link to={"/forms/registration"}>
            <button className="button" role="button">
              Register
            </button>
          </Link>

          <Link to={"/forms/login"}>
            <button className="button" role="button">
              Login
            </button>
          </Link>
        </>
      )}
    </>
  );
}

export default HomePage;
