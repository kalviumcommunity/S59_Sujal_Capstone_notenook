import { Link } from "react-router-dom";
import { useContext } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { UserContext } from "../../context/userContext";

import pic from "../../assets/pic.png";

function HeaderProfile() {
  const { user } = useContext(UserContext);

  return (
    <div className="py-2 px-4 rounded-md">
      <Link
        to={"/notenook/profile"}
        className="flex gap-3 justify-between items-center"
      >
        <Avatar>
          <AvatarImage src={pic} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p className="text-sm md:text-base w-[70px] overflow-hidden whitespace-nowrap text-ellipsis">
          {user?.username}
        </p>{" "}
      </Link>
    </div>
  );
}

export default HeaderProfile;
