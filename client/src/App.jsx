import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";

import "./App.css";
import Forms from "./pages/Forms";
import HomePage from "./pages/HomePage";
import DashBoard from "./pages/DashBoard";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forms/*" element={<Forms />} />
        <Route path="/dashboard/*" element={<DashBoard />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
