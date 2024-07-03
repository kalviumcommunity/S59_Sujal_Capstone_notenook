import { useContext } from "react";
import { Link } from "react-router-dom";

import { IoChatbubbleOutline } from "react-icons/io5";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { UserContext } from "../context/userContext";
import pic from "../assets/pic.png";

function Connections() {
  const { user } = useContext(UserContext);
  const friends = user?.friends;
  return (
    <div className="flex bg-[#09090B] flex-col p-4 connectionsDiv relative w-[325px] h-full rounded-lg overflow-y-hidden">
      {!friends?.length && (
        <p className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-sm text-neutral-300 text-center">
          Your Top connections Appear here
        </p>
      )}

      <h1 className="text-xl font-bold mb-4 text-neutral-400">Connections</h1>

      <div className="connectionList overflow-y-scroll">
        {friends &&
          friends.map((friend, i) => <Connection key={i} friend={friend} />)}
      </div>
    </div>
  );
}

function Connection({ friend }) {
  return (
    <div className="connection flex w-full justify-between py-3 px-2 items-center rounded-md mb-3 hover:bg-[#0C0A09]">
      <Link to={`/notenook/viewUser/${friend._id}`}>
        <div className="connectionInfo w-[80%] flex items-center gap-4">
          <Avatar>
            <AvatarImage src={pic} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="connectionUsername">{friend.username}</p>
        </div>
      </Link>

      <IoChatbubbleOutline className="text-2xl text-yellow-400" />
    </div>
  );
}
export default Connections;
