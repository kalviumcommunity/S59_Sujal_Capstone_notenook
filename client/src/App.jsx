import "./App.css";
import Loader from "./components/Loader";
import Forms from "./pages/Forms";
import HomePage from "./pages/HomePage";
import RegistrationForm from "./components/RegistrationForm";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forms/*" element={<Forms />} />
        <Route path="/form" element={<RegistrationForm />} />
      </Routes>
    </>
  );
}

export default App;
