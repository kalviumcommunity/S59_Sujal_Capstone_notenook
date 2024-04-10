import "./App.css";
import Forms from "./pages/Forms";
import HomePage from "./pages/HomePage";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forms/*" element={<Forms />} />
      </Routes>
    </>
  );
}

export default App;
