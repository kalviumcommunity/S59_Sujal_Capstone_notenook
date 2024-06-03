import React, { useContext, useState } from "react";
import ChatSidebar from "../../components/ChatPageCompontents/ChatSidebar";
import Chat from "../../components/ChatPageCompontents/Chat";
import "../../css/ChatPage.css";
import {  Route, Routes } from "react-router-dom";
import { DeviceWidthContext } from "../../context/deviceWidthContext";

const ChatPage = () => {
  const width = useContext(DeviceWidthContext);
  return (
    <div className="chat-page">
      {width > 900 ? <ChatPageForDesktops /> : <ChatPageForPhones />}
    </div>
  );
};

function ChatPageForPhones() {
  return (
    <Routes>
      <Route path="" element={<ChatSidebar />}></Route>
      <Route path="/:id" element={<Chat />}></Route>
    </Routes>
  );
}

function ChatPageForDesktops() {
  return (
    <>
      <ChatSidebar />
      <Chat />
    </>
  );
}

export default ChatPage;
