import { useContext } from "react";
import { Link } from "react-router-dom";

import { Button } from "../components/ui/button";
import { UserContext } from "../context/userContext";

import HomeNavBar from "../components/HomePageComponents/NavBar";
import logo from "../assets/logo.svg";
import extractTokenFromCookie from "../Functions/ExtractTokenFromCookie";

function HomePage() {
  const { user } = useContext(UserContext);

  return (
    <div>
      <HomeNavBar />
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
        {user ? (
          <Link to="/notenook/dashboard">
            <Button>Dashboard</Button>
          </Link>
        ) : (
          <Link to={"/forms/registration"}>
            <Button>Get Started</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default HomePage;
