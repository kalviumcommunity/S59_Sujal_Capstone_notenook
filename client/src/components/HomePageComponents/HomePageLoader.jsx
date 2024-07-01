import logo from "../../assets/logo.svg";
import "../../css/Loader.css";

function HomePageLoader() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <img src={logo} alt="logo" className="w-24 md:w-28 mb-12" />
      <div className="loader w-16 md:w-20" aria-label="Loading"></div>
    </div>
  );
}

export default HomePageLoader;
