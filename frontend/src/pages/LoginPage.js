import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from './PageTransition';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [loginStatus, setLoginStatus] = useState({ message: "", isError: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleMenu = () => {
    setIsMenuCollapsed(!isMenuCollapsed);
  };

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    // Clear credentials when switching modes
    setUniversityId("");
    setPassword("");
    // Clear any previous login status messages
    setLoginStatus({ message: "", isError: false });
  };

  // Define the handleSuccessfulLogin function
  const handleSuccessfulLogin = (userData) => {
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Store isAdmin flag separately for easier access
    localStorage.setItem('isAdmin', userData.isAdmin || false);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('loginStatusChanged'));
    
    // Redirect based on login type
    let redirectPath = '/menu';
    
    // If admin login, redirect to admin dashboard
    if (userData.isAdmin) {
      redirectPath = '/admin/dashboard';
    } else {
      // Use stored redirect path or default to menu
      redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/menu';
      sessionStorage.removeItem('redirectAfterLogin'); // Clear it after use
    }
    
    navigate(redirectPath);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!universityId || !password) {
      setLoginStatus({
        message: "Please enter both " + (isAdminMode ? "Admin ID" : "University ID") + " and password",
        isError: true
      });
      return;
    }
    
    setIsLoading(true);
    setLoginStatus({ message: "", isError: false });
    
    const loginData = { universityId, password, isAdmin: isAdminMode };
    try {
      // Use the appropriate endpoint based on login type
      const endpoint = isAdminMode 
        ? "http://localhost:5000/api/auth/admin/login" 
        : "http://localhost:5000/api/auth/login";
        
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token
        localStorage.setItem("token", data.token);
        
        setLoginStatus({
          message: "Login successful! Redirecting...",
          isError: false
        });
        
        // Call the handleSuccessfulLogin function with the user data from response
        handleSuccessfulLogin(data.user);
      } else {
        setLoginStatus({
          message: data.message || "Login failed. Please try again.",
          isError: true
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setLoginStatus({
        message: "Cannot connect to server. Please check your connection and try again.",
        isError: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-rose-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg overflow-hidden flex">
          {/* Left sidebar */}
          <div className={`${isMenuCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 p-6 flex flex-col transition-all duration-300 relative`}>
            <div className="flex items-center mb-12">
              <button className="mr-4" onClick={toggleMenu}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
              {!isMenuCollapsed && (
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-800 rounded-full flex items-center justify-center relative">
                    <div className="h-6 w-6 bg-white rounded-full absolute right-0 bottom-0 mr-1 mb-1"></div>
                    <span className="text-white font-bold relative z-10">C</span>
                  </div>
                  <div className="ml-2">
                    <span className="font-semibold text-gray-800">CAMPUS</span>
                    <span className="block text-gray-500 text-xs">CAFE</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Navigation items */}
            <nav className="flex flex-col space-y-4 mt-8">
              <a href="/login" className="flex items-center text-orange-400 font-medium relative group">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                {!isMenuCollapsed && "Sign In"}
                <div className="w-1 h-8 bg-orange-400 absolute -right-6 rounded-l"></div>
              </a>
              <a href="/signup" className="flex items-center text-gray-600 font-medium">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {!isMenuCollapsed && "Sign Up"}
              </a>
            </nav>
          </div>
          
          {/* Main content */}
          <div className="flex-1 p-8 flex">
            <div className="w-3/5 pr-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {isAdminMode ? "Admin Login" : "Login"}
              </h1>
              <p className="text-gray-600 mb-8">
                {isAdminMode 
                  ? "Login to access your CAMPUSCAFE admin panel" 
                  : "Login to access your CAMPUSCAFE account"}
              </p>
              
              {/* Login status message */}
              {loginStatus.message && (
                <div className={`p-3 mb-4 rounded-md ${loginStatus.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {loginStatus.message}
                </div>
              )}
              
              {/* Login form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm mb-1">
                    {isAdminMode ? "Admin ID" : "University ID"}
                  </label>
                  <input 
                    type="text" 
                    placeholder={isAdminMode ? "ADMIN001" : "CCE23CS095"} 
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={universityId}
                    onChange={(e) => setUniversityId(e.target.value)}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm mb-1">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={20} className="text-gray-500" /> : <Eye size={20} className="text-gray-500" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <input type="checkbox" id="remember" className="mr-2" />
                    <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
                  </div>
                  <a href="#" className="text-sm text-red-400">Forgot Password</a>
                </div>
                
                <button 
                  type="submit" 
                  className={`w-full ${isAdminMode ? 'bg-red-600' : 'bg-blue-600'} text-white p-3 rounded-md font-medium mb-4 flex justify-center items-center`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {isLoading ? "Logging in..." : (isAdminMode ? "Login as Admin" : "Login")}
                </button>
                
                {/* Admin login toggle */}
                <p className="text-center text-sm text-gray-600 mb-4">
                  <button 
                    type="button" 
                    onClick={toggleAdminMode} 
                    className="text-blue-500 hover:underline"
                  >
                    {isAdminMode ? "Switch to Student Login" : "Switch to Admin Login"}
                  </button>
                </p>
                
                {!isAdminMode && (
                  <>
                    <p className="text-center text-sm text-gray-600 mb-6">
                      Don't have an account? <a href="/signup" className="text-red-400">Sign up</a>
                    </p>
                    
                    <div className="text-center text-sm text-gray-500 mb-4">Or login with</div>
                    
                    <button type="button" className="w-full border border-gray-300 p-3 rounded-md flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" className="text-center">
                        <path d="M12.545, 10.239v3.821h5.445c-0.712, 2.315-2.647, 3.972-5.445, 3.972-3.332, 0-6.033-2.701-6.033-6.032s2.701-6.032, 6.033-6.032c1.498, 0, 2.866, 0.549, 3.921, 1.453l2.814-2.814C17.503, 2.988, 15.139, 2, 12.545, 2 7.021, 2, 2.543, 6.477, 2.543, 12s4.478, 10, 10.002, 10c8.396, 0, 10.249-7.85, 9.426-11.748l-9.426, -0.013z" fill="#4285F4"/>
                      </svg>
                    </button>
                  </>
                )}
              </form>
            </div>
            
            <div className="w-2/5 bg-gray-100 rounded-xl flex items-center justify-center p-4">
              <img 
                src={require("./assets/images/login.png")} 
                alt="Secure login illustration" 
                className="w-full h-full object-contain object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;