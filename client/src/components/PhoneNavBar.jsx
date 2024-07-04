import { useState } from "react";
import { MdAssistantNavigation } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaNoteSticky } from "react-icons/fa6";
import { IoAddCircle } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { IoChatbubbles } from "react-icons/io5";

const style = {
  color: "white",
};

const getClassNames = (isActive, baseClasses, activeClasses, hoverClasses) => {
  return `${baseClasses} ${hoverClasses} ${isActive ? activeClasses : ""}`;
};

function PhoneNavBar() {
  const [expand, setExpand] = useState(false);

  return (
    <div className="phoneNavBar absolute bottom-0 left-0 flex-col z-50">
      <div
        className={`w-[50px] h-[50px] bg-primary ml-2 mb-2 p-1.5 shadow-xl cursor-pointer rounded-full transition-transform duration-300 ${
          expand ? "rotate-180" : ""
        }`}
        onClick={() => setExpand(!expand)}
      >
        <MdAssistantNavigation className="w-full h-full text-white" />
      </div>
      <div
        className={`w-screen flex items-center transition-all duration-300 bg-[#09090b] ${
          expand ? "h-14 opacity-100" : "h-0 opacity-0"
        } overflow-hidden backdrop-blur-md shadow-lg`}
      >
        <div className="flex w-screen items-center justify-around">
          <NavLink
            exact
            to="/notenook/dashboard"
            className={({ isActive }) =>
              getClassNames(
                isActive,
                "navButton MdDashboard flex items-center justify-center text-xl p-2.5 w-fit rounded-full border-2 transition-transform ease-in-out duration-300 bg-[#3c310b] border-[#F1C40F]",
                "scale-110 text-[#F1C40F] bg-opacity-70",
                "hover:scale-110"
              )
            }
            activeClassName="text-[#F1C40F] bg-opacity-70"
          >
            <MdDashboard style={style} />
          </NavLink>

          <NavLink
            to="/notenook/notes"
            className={({ isActive }) =>
              getClassNames(
                isActive,
                "navButton noteIcon flex items-center justify-center text-xl p-2.5 w-fit rounded-full border-2 transition-transform ease-in-out duration-300 bg-[#3c310b] border-[#E67E22]",
                "scale-110 text-[#E67E22] bg-opacity-70",
                "hover:scale-110"
              )
            }
            activeClassName="text-[#E67E22] bg-opacity-70"
          >
            <FaNoteSticky style={style} />
          </NavLink>

          <NavLink
            to="/notenook/postNotes"
            className={({ isActive }) =>
              getClassNames(
                isActive,
                "navButton addIcon flex items-center justify-center text-xl p-2.5 w-fit rounded-full border-2 transition-transform ease-in-out duration-300 bg-[#3c310b] border-[#2ECC71]",
                "scale-110 text-[#2ECC71] bg-opacity-70",
                "hover:scale-110"
              )
            }
            activeClassName="text-[#2ECC71] bg-opacity-70"
          >
            <IoAddCircle style={style} />
          </NavLink>

          <NavLink
            to="/notenook/friends"
            className={({ isActive }) =>
              getClassNames(
                isActive,
                "navButton friendsIcon flex items-center justify-center text-xl p-2.5 w-fit rounded-full border-2 transition-transform ease-in-out duration-300 bg-[#3c310b] border-[#3498DB]",
                "scale-110 text-[#3498DB] bg-opacity-70",
                "hover:scale-110"
              )
            }
            activeClassName="text-[#3498DB] bg-opacity-70"
          >
            <FaUserFriends style={style} />
          </NavLink>

          <NavLink
            to="/notenook/chatPage"
            className={({ isActive }) =>
              getClassNames(
                isActive,
                "navButton chatIcon flex items-center justify-center text-xl p-2.5 w-fit rounded-full border-2 transition-transform ease-in-out duration-300 bg-[#3c310b] border-[#9B59B6]",
                "scale-110 text-[#9B59B6] bg-opacity-70",
                "hover:scale-110"
              )
            }
            activeClassName="text-[#9B59B6] bg-opacity-70"
          >
            <IoChatbubbles style={style} />
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default PhoneNavBar;
