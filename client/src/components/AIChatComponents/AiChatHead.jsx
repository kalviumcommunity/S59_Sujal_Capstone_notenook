import { useRef, useState } from "react";
import Draggable from "react-draggable";
import aiChatHead from "../../assets/AiChatHead.png";

const AiChatHead = ({ setIsAiChatVisible, isAiChatVisible }) => {
  const chatHeadRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleStartDrag = () => {
    console.log("start");
    setIsDragging(true);
  };

  const handleStopDrag = () => {
    console.log("end");
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!isDragging) {
      setIsAiChatVisible(!isAiChatVisible);
    }
  };

  return (
    <Draggable
      bounds="parent"
      nodeRef={chatHeadRef}
      onStart={handleStartDrag}
      onStop={handleStopDrag}
    >
      <div
        ref={chatHeadRef}
        className="absolute right-0 h-16 w-16 z-[100] rounded-[50%] cursor-pointer"
        style={{
          backgroundImage: `url(${aiChatHead})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onClick={handleClick}
      ></div>
    </Draggable>
  );
};

export default AiChatHead;
