import React from 'react';
import { useNavigate } from "react-router-dom";


const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-rose-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg overflow-hidden relative">
        {/* Vertical stripes background */}
        <div className="absolute inset-0 flex w-full">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex-1 bg-gray-100 mx-2 opacity-30" />
          ))}
        </div>
        
        {/* Header */}
        <header className="relative flex justify-between items-center px-8 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gray-800 rounded-full flex items-center justify-center relative">
              <div className="h-6 w-6 bg-white rounded-full absolute right-0 bottom-0 mr-1 mb-1"></div>
              <span className="text-white font-bold relative z-10">C</span>
            </div>
            <span className="ml-2 font-semibold text-gray-800">CAMPUS</span>
            <span className="text-gray-500 text-sm ml-1">CAFE</span>
          </div>
          
          <nav className="flex items-center">
            
            <button 
              onClick={() => navigate("/home")} 
              className="mx-4 text-sm font-medium text-gray-800">
              Home
            </button>
            <button 
              onClick={() => navigate("/about")} 
              className="mx-4 text-sm font-medium text-gray-800">
              About
            </button>
            <button 
              onClick={() => navigate("/contact")} 
              className="mx-4 text-sm font-medium text-gray-800">
              Contact
            </button>
            <button 
              onClick={() =>{
                console.log("Navigating to /menu...");
                navigate("/menu");
              }} 
              className="ml-4 bg-orange-300 text-white px-4 py-2 rounded-full text-sm font-medium">
              Get started
            </button>
            
          </nav>
        </header>
        
        {/* Main content */}
        <main className="relative px-8 py-16 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-bold text-indigo-800 mb-6">
            Welcome to<br />
            MealMate Website
          </h1>
          
          <p className="text-gray-600 max-w-xl mx-auto">
            Welcome to MealMate, a hassle-free way to pre-book 
            your meals at the canteen. Our platform simplifies food
            ordering by allowing you to browse the daily menu, select
            your favorite dishes, and register a token – all in just a few
            clicks!
          </p>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;