import React from "react";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/authContext";

import Forms from "./pages/Forms";
import HomePage from "./pages/HomePage";
import NoteNook from "./pages/NoteNook";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forms/*" element={<Forms />} />
        <Route path="/notenook/*" element={<NoteNook />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
