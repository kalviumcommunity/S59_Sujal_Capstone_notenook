import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import { Button } from "../ui/button";
function HomeNavBar() {
  return (
    <div className="flex w-screen justify-between items-center py-4 p-8">
      <Link to="/">
        <img src={logo} alt="" className="logo h-16 md:h-20 " />
      </Link>

      <div className="flex w-52 justify-between items-center">
        <HomePageButtons />
      </div>
    </div>
  );
}

function HomePageButtons() {
  const token = extractTokenFromCookie();

  return (
    <>
      {token ? (
        <>
          <Link to="/notenook/dashboard">
            <Button>Dashboard</Button>
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
            <Button>Register</Button>
          </Link>

          <Link to={"/forms/login"}>
            <Button>Login</Button>
          </Link>
        </>
      )}
    </>
  );
}

export default HomeNavBar;
