import React from "react";
import { Routes, Route } from "react-router-dom"; // ✅ Only import what you use

import LandingPage from "./pages/LandingPage";
import MenuPage from "./pages/MenuPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
        </Routes>
    
    );
    
}

export default App;
