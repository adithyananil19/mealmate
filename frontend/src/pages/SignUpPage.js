import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    universityId: '',
    userType: 'regular',
    password: '',
    confirmPassword: '',
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const { name, email, universityId, password, confirmPassword } = formData;

    if (!name || !email || !universityId || !password || !confirmPassword) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    if (!agreeToTerms) {
      setErrorMessage('Please agree to the terms and policies');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          universityId,
          userType: formData.userType,
          password,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Account created! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setErrorMessage(data.message || 'Error during signup. Please try again.');
      }
    } catch {
      setErrorMessage('Connection error. Please check your internet and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex font-outfit">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/25 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-600/15 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-xl font-bold">
              M
            </div>
            <div>
              <div className="font-bold text-xl">MealMate</div>
              <div className="text-xs text-stone-500 tracking-widest uppercase">Campus Cafe</div>
            </div>
          </button>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="text-7xl mb-8">🎓</div>
              <h2 className="text-4xl font-bold leading-tight mb-4">
                Join the Campus<br />Cafe Revolution
              </h2>
              <p className="text-stone-400 text-lg leading-relaxed">
                Create your student account and start pre-ordering meals. No more waiting in long queues!
              </p>

              <div className="mt-8 space-y-3">
                {['Browse daily menu 🍽️', 'Place orders in advance 🛒', 'Get unique order codes 🎫', 'Skip the queue ⚡'].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-3 text-stone-300"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <p className="text-stone-600 text-sm">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-orange-400 hover:text-orange-300 transition-colors">
              Sign in →
            </button>
          </p>
        </div>
      </div>

      {/* Right panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-lg font-bold">
              M
            </div>
            <span className="font-bold text-xl">MealMate</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-stone-400 mb-8">Set up your campus cafe account in seconds.</p>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl mb-6 text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20"
            >
              {errorMessage}
            </motion.div>
          )}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl mb-6 text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20"
            >
              ✅ {successMessage}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="input-field"
                  value={formData.name}
                  onChange={handleChange}
                  id="full-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">User Type</label>
                <select
                  name="userType"
                  className="input-field"
                  value={formData.userType}
                  onChange={handleChange}
                  id="user-type"
                >
                  <option value="regular">Regular</option>
                  <option value="non-regular">Non-Regular</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@campus.edu"
                  className="input-field"
                  value={formData.email}
                  onChange={handleChange}
                  id="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">University ID</label>
                <input
                  type="text"
                  name="universityId"
                  placeholder="CCE23CS000"
                  className="input-field"
                  value={formData.universityId}
                  onChange={handleChange}
                  id="university-id-signup"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Min. 6 characters"
                  className="input-field pr-12"
                  value={formData.password}
                  onChange={handleChange}
                  id="password-signup"
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

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  className="input-field pr-12"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  id="confirm-password"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-stone-600 bg-stone-800 accent-orange-500"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                id="terms"
              />
              <span className="text-sm text-stone-400">
                I agree to the{' '}
                <span className="text-orange-400">Terms of Service</span> and{' '}
                <span className="text-orange-400">Privacy Policy</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 text-base mt-2"
              id="create-account-btn"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account →'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;