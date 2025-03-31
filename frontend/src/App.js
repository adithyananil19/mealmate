import React from "react";
import axios from 'axios';
import { useLocation, BrowserRouter,Routes, Route } from "react-router-dom"; // ✅ Only import what you use
import { AnimatePresence } from 'framer-motion';
import LandingPage from "./pages/LandingPage";
import MenuPage from "./pages/MenuPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

import AdminPage from "./pages/AdminPage";


// Add this axios configuration somewhere in your app
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
function AnimatedRoutes() {
    const location = useLocation();
    
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
             <Route path="/signup" element={<SignUpPage />} />
             <Route path="/login" element={<LoginPage />} />
             <Route path="/" element={<LandingPage />} />
             <Route path="/menu" element={<MenuPage />} />
             <Route path="/admin/dashboard" element={<AdminPage />} />
         
        </Routes>
      </AnimatePresence>
    );
  }
  
  function App() {
    return (
      
        <AnimatedRoutes />
      
    );
  }
  
  export default App;
