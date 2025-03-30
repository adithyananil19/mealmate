import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [userType, setUserType] = useState("regular");
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleMenu = () => {
    setIsMenuCollapsed(!isMenuCollapsed);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form validation and submission logic would go here
  };

  return (
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
            <a href="/login" className="flex items-center text-gray-600 font-medium relative">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
              {!isMenuCollapsed && "Sign In"}
            </a>
            <a href="/signup" className="flex items-center text-orange-400 font-medium relative group">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {!isMenuCollapsed && "Sign Up"}
              <div className="w-1 h-8 bg-orange-400 absolute -right-6 rounded-l"></div>
            </a>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-8 flex">
          {/* Left side - Image */}
          <div className="w-2/5 bg-gray-100 rounded-xl flex items-center justify-center p-4 mr-8">
            <img 
              src="/api/placeholder/280/380" 
              alt="Sign up illustration" 
              className="max-w-full"
            />
          </div>
          
          {/* Right side - Form */}
          <div className="w-3/5">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign up</h1>
            <p className="text-gray-600 mb-6">Let's get you all set up so you can access your personal account.</p>
            
            {/* Signup form */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">User Type</label>
                  <div className="relative">
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white"
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                    >
                      <option value="non-regular">Non-Regular</option>
                      <option value="regular">Regular</option>
                      
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="john.doe@gmail.com" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">University ID</label>
                  <input 
                    type="text" 
                    placeholder="CCE23CS000" 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={universityId}
                    onChange={(e) => setUniversityId(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm mb-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              
              <div className="mb-6">
                <label className="block text-sm mb-1">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <EyeOff size={20} className="text-gray-500" /> : <Eye size={20} className="text-gray-500" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="mr-2"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)} 
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to all the <span className="text-red-400">Terms</span> and <span className="text-red-400">Privacy Policies</span>
                </label>
              </div>
              
              <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md font-medium mb-4">
                Create account
              </button>
              
              <p className="text-center text-sm text-gray-600 mb-6">
                Already have an account? <a href="/login" className="text-blue-600">Login</a>
              </p>
              
              <div className="text-center text-sm text-gray-500 mb-4">Or Sign up with</div>
              
              <button type="button" className="w-full border border-gray-300 p-3 rounded-md flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" className="text-center">
                  <path d="M12.545, 10.239v3.821h5.445c-0.712, 2.315-2.647, 3.972-5.445, 3.972-3.332, 0-6.033-2.701-6.033-6.032s2.701-6.032, 6.033-6.032c1.498, 0, 2.866, 0.549, 3.921, 1.453l2.814-2.814C17.503, 2.988, 15.139, 2, 12.545, 2 7.021, 2, 2.543, 6.477, 2.543, 12s4.478, 10, 10.002, 10c8.396, 0, 10.249-7.85, 9.426-11.748l-9.426, -0.013z" fill="#4285F4"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;