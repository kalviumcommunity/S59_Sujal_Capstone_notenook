import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Message from "./Message";
import AiChatInput from "./AiChatInput";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import "../../css/ChatComponent.css";

const AiChat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_REACT_APP_AI_CHAT_SOCKET, {
      auth: {
        token: extractTokenFromCookie(),
      },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to AI chat server");
    });

    newSocket.on("connectionSuccess", (data) => {
      console.log(data.message);
      setMessages(
        data.history.map((msg) => ({ role: msg[0], content: msg[1] }))
      );
    });

    newSocket.on("receiveMessage", (data) => {
      console.log(data.assistantMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: data.assistantMessage },
      ]);
      setIsLoading(false);
    });

    newSocket.on("errorMessage", (error) => {
      console.error(error);
      setIsLoading(false);
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: messageInput },
      ]);
      setIsLoading(true);
      socket.emit("sendMessage", { content: messageInput });
      setMessageInput("");
    }
  };

  return (
    <div id="ai-chat">
      <div id="ai-messages">
        {messages.map((msg, index) => (
          <div className="flex flex-col" key={index}>
            <Message role={msg.role} content={msg.content} />
          </div>
        ))}
        {isLoading && <div className="ai-message assistant">Loading....</div>}
        <div ref={lastMessageRef}></div>
      </div>

      <AiChatInput
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AiChat;
