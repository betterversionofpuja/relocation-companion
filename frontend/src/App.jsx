import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ComparePage from "./pages/ComparePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import SavedComparisonsPage from "./pages/SavedComparisonsPage";
import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage";

import "./styles/spaceBackground.css";

function App() {
  return (
    <div className="min-h-screen space-bg">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/saved-comparisons" element={<SavedComparisonsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;