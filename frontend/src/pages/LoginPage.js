import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [loginStatus, setLoginStatus] = useState({ message: '', isError: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const navigate = useNavigate();

  const handleSuccessfulLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAdmin', userData.isAdmin || false);
    window.dispatchEvent(new Event('loginStatusChanged'));
    if (userData.isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate(sessionStorage.getItem('redirectAfterLogin') || '/menu');
      sessionStorage.removeItem('redirectAfterLogin');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!universityId || !password) {
      setLoginStatus({ message: 'Please fill in all fields', isError: true });
      return;
    }
    setIsLoading(true);
    setLoginStatus({ message: '', isError: false });

    const endpoint = isAdminMode
      ? 'http://localhost:5000/api/auth/admin/login'
      : 'http://localhost:5000/api/auth/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ universityId, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setLoginStatus({ message: 'Login successful! Redirecting...', isError: false });
        setTimeout(() => handleSuccessfulLogin(data.user), 500);
      } else {
        setLoginStatus({ message: data.message || 'Login failed. Please try again.', isError: true });
      }
    } catch {
      setLoginStatus({ message: 'Cannot connect to server. Please try again.', isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex font-outfit">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950">
        {/* Animated gradient blobs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-orange-600/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-orange-800/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-xl font-bold">
              M
            </div>
            <div>
              <div className="font-bold text-xl">MealMate</div>
              <div className="text-xs text-stone-500 tracking-widest uppercase">Campus Cafe</div>
            </div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="text-7xl mb-8">
                {isAdminMode ? '🛡️' : '🍽️'}
              </div>
              <h2 className="text-4xl font-bold leading-tight mb-4">
                {isAdminMode
                  ? 'Manage Your\nCanteen'
                  : 'Order Ahead,\nEat Better'}
              </h2>
              <p className="text-stone-400 text-lg leading-relaxed">
                {isAdminMode
                  ? 'Access the admin dashboard to manage orders, menu, and inventory.'
                  : 'Pre-order your meals and skip the queue. Get your unique code and collect at the counter.'}
              </p>
            </motion.div>
          </div>

          <div className="flex gap-4 items-center text-sm text-stone-500">
            <span>🔒 Secure login</span>
            <span>•</span>
            <span>⚡ Fast access</span>
            <span>•</span>
            <span>🎓 Campus only</span>
          </div>
        </div>
      </div>

      {/* Right panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-lg font-bold">
              M
            </div>
            <span className="font-bold text-xl">MealMate</span>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-stone-900 rounded-xl p-1 mb-8">
            <button
              onClick={() => { setIsAdminMode(false); setUniversityId(''); setPassword(''); setLoginStatus({ message: '', isError: false }); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                !isAdminMode
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Student Login
            </button>
            <button
              onClick={() => { setIsAdminMode(true); setUniversityId(''); setPassword(''); setLoginStatus({ message: '', isError: false }); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                isAdminMode
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Admin Login
            </button>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            {isAdminMode ? 'Admin Portal' : 'Welcome Back'}
          </h1>
          <p className="text-stone-400 mb-8">
            {isAdminMode ? 'Sign in to manage the canteen.' : 'Sign in to your campus cafe account.'}
          </p>

          {loginStatus.message && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl mb-6 text-sm font-medium border ${
                loginStatus.isError
                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : 'bg-green-500/10 text-green-400 border-green-500/20'
              }`}
            >
              {loginStatus.message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">
                {isAdminMode ? 'Admin ID' : 'University ID'}
              </label>
              <input
                type="text"
                placeholder={isAdminMode ? 'ADMIN001' : 'CCE23CS095'}
                className="input-field"
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                id="university-id"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-stone-600 bg-stone-800" />
                <span className="text-sm text-stone-400">Remember me</span>
              </label>
              <button type="button" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 active:scale-95 disabled:opacity-50 ${
                isAdminMode
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 hover:shadow-lg hover:shadow-red-500/25'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:shadow-lg hover:shadow-orange-500/25'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                isAdminMode ? 'Sign in as Admin' : 'Sign In'
              )}
            </button>
          </form>

          {!isAdminMode && (
            <p className="text-center text-sm text-stone-500 mt-6">
              Don't have an account?{' '}
              <button onClick={() => navigate('/signup')} className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                Sign up
              </button>
            </p>
          )}

          <button
            onClick={() => navigate('/')}
            className="mt-6 w-full text-center text-sm text-stone-600 hover:text-stone-400 transition-colors"
          >
            ← Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;