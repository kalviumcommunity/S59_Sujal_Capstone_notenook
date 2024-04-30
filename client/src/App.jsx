import React from "react";
import { Routes, Route } from "react-router-dom";

import { UserProvider } from "./context/userContext";

import Forms from "./pages/Forms";
import HomePage from "./pages/HomePage";
import NoteNook from "./pages/NoteNook";

import "./App.css";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forms/*" element={<Forms />} />
        <Route path="/notenook/*" element={<NoteNook />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
