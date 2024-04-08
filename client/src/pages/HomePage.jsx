import React from "react";
import reading from "../assets/reading.jpeg";
import logo from "../assets/logo.jpeg";
import { Link } from "react-router-dom";
function HomePage() {
  return (
    <div>
      <div className="flex w-screen justify-between items-center py-4 px-8">
        <Link to="/">
          <img src={logo} alt="" className="h-20 md:h-24 w-auto" />
        </Link>

        <div className="flex w-52 justify-between items-center">
          <Link to={"/forms/registration"}>
            <button class="button" role="button">
              Register
            </button>
          </Link>

          <button class="button" role="button">
            Login
          </button>
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

export default HomePage;
