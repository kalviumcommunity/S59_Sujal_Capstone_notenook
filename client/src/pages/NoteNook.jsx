import "../css/NoteNook.css";
import MyNotes from "../components/DashBoardComponents/MyNotes";
import Stats from "../components/DashBoardComponents/Stats";
import ReviewList from "../components/DashBoardComponents/ReviewList";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import { Routes, Route } from "react-router-dom";
function NoteNook() {
  return (
    <div className="notenook">
      <NavBar />
      <Header />
      <Routes></Routes>
    </div>
  );
}

export default NoteNook;
