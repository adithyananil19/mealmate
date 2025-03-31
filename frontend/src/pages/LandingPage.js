import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState('home');

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-5" style={{ backgroundColor: '#ffd8cc' }}>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header with navigation */}
        <div className="flex justify-between items-center px-10 py-6 border-b border-gray-100">
          {/* Logo */}
          <div className="flex items-center">
            <div>
              <div className="font-bold text-2xl">CAMPUS</div>
              <div className="text-xs text-gray-500 tracking-wider">CAFE</div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex gap-8">
            <button 
              className={`relative pb-1 font-medium ${activePage === 'home' ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-400' : ''}`}
              onClick={() => handlePageChange('home')}
            >
              Home
            </button>
            <button 
              className={`relative pb-1 font-medium ${activePage === 'about' ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-400' : ''}`}
              onClick={() => handlePageChange('about')}
            >
              About
            </button>
            <button 
              className={`relative pb-1 font-medium ${activePage === 'contact' ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-400' : ''}`}
              onClick={() => handlePageChange('contact')}
            >
              Contact
            </button>
          </div>
          
          {/* Get Started Button */}
          <button 
              onClick={() =>{
                console.log("Navigating to /menu...");
                navigate("/menu");
              }} 
              className="ml-4 bg-orange-300 text-white px-4 py-2 rounded-full text-sm font-medium">
              Get started
            </button>
        </div>
        
        {/* Content */}
        <div className="p-16 text-center min-h-96">
          {/* Home Page */}
          {activePage === 'home' && (
            <div>
              <h1 className="text-5xl font-bold text-indigo-800 mb-6">Welcome to<br/>MealMate Website</h1>
              <p className="text-gray-500 max-w-lg mx-auto">
                Welcome to MealMate, a hassle-free way to pre-book your meals at the canteen. Our platform simplifies food ordering by allowing you to browse the daily menu, select your favorite dishes, and register a token — all in just a few clicks!
              </p>
            </div>
          )}
          
          {/* About Page */}
          {activePage === 'about' && (
            <div>
              <h1 className="text-5xl font-bold text-indigo-800 mb-6">About MealMate</h1>
              <div className="text-gray-500 max-w-lg mx-auto space-y-4">
                <p>
                  MealMate is a comprehensive canteen management system designed to streamline food service in educational institutions and corporate environments. Our platform offers features such as digital menu browsing, pre-ordering capabilities, and cashless payment options.
                </p>
                <p>
                  Users can easily view nutritional information, customize their meals according to dietary preferences, and avoid long waiting times during peak hours. The system also sends notifications when orders are ready for pickup.
                </p>
                <p>
                  For canteen administrators, MealMate provides valuable analytics on food preferences, helps manage inventory efficiently, and reduces food waste through accurate demand forecasting. Our user-friendly interface ensures a seamless experience for both customers and staff.
                </p>
              </div>
            </div>
          )}
          
          {/* Contact Page */}
          {activePage === 'contact' && (
            <div>
              <h1 className="text-5xl font-bold text-indigo-800 mb-6">Contact Us</h1>
              <div className="flex flex-wrap justify-center gap-8 mt-8">
                <div className="bg-gray-50 p-6 rounded-lg w-64">
                  <h2 className="font-bold text-indigo-800 mb-3">Social Media</h2>
                  <ul className="text-left space-y-2">
                    <li>Instagram: @mealmate_official</li>
                    <li>Twitter: @MealMate</li>
                    <li>Facebook: MealMateCampus</li>
                    <li>LinkedIn: MealMate Solutions</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg w-64">
                  <h2 className="font-bold text-indigo-800 mb-3">Contact Information</h2>
                  <ul className="text-left space-y-2">
                    <li>Phone: (555) 123-4567</li>
                    <li>Email: support@mealmate.com</li>
                    <li>Address: 123 Campus Drive</li>
                    <li>Hours: Mon-Fri, 8am-6pm</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;