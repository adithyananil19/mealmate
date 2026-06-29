import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  {
    icon: '🍽️',
    title: 'Browse the Menu',
    desc: 'Explore today\'s full menu with categories, prices, and availability — all in real time.',
  },
  {
    icon: '🛒',
    title: 'Order in Advance',
    desc: 'Add items to your cart and place your order before you even leave your desk.',
  },
  {
    icon: '🎫',
    title: 'Show Your Code',
    desc: 'Get a unique order code when approved. Just show it at the counter — pay & collect!',
  },
];

const foodEmojis = ['🍜', '🍔', '🥗', '🍕', '🍛', '🥘', '🍱', '🧆'];

const LandingPage = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('home');

  return (
    <div className="min-h-screen bg-stone-950 font-outfit text-stone-100">
      {/* Gradient orbs background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-orange-700/10 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-lg font-bold">
            M
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight">MealMate</span>
            <span className="block text-xs text-stone-500 leading-none tracking-widest uppercase">Campus Cafe</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['home', 'about', 'contact'].map(page => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`capitalize text-sm font-medium transition-colors duration-200 relative pb-1 ${
                activePage === page ? 'text-orange-400' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {page}
              {activePage === page && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-stone-400 hover:text-white transition-colors px-4 py-2"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/menu')}
            className="btn-primary text-sm px-5 py-2.5"
          >
            Get Started →
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        {activePage === 'home' && (
          <div>
            {/* Hero */}
            <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-sm text-orange-400 font-medium mb-6">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  Smart Canteen System — Now Live
                </div>

                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                  Skip the Queue,
                  <br />
                  <span className="gradient-text">Order Smarter</span>
                </h1>

                <p className="text-stone-400 text-lg max-w-xl mx-auto mb-10">
                  Pre-order your meals, get a unique token, and pick up your food without waiting.
                  Built for your campus canteen.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/signup')}
                    className="btn-primary px-8 py-4 text-base"
                  >
                    Create Free Account
                  </button>
                  <button
                    onClick={() => navigate('/menu')}
                    className="btn-secondary px-8 py-4 text-base"
                  >
                    Browse Menu
                  </button>
                </div>
              </motion.div>

              {/* Floating food emojis */}
              <div className="relative w-full max-w-2xl h-32 mt-16">
                {foodEmojis.map((emoji, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-4xl"
                    style={{
                      left: `${(i / foodEmojis.length) * 90 + 5}%`,
                      top: `${Math.sin(i * 0.8) * 30 + 30}%`,
                    }}
                    animate={{ y: [0, -12, 0] }}
                    transition={{
                      duration: 3 + i * 0.3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.2,
                    }}
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Features */}
            <section className="px-6 pb-24 max-w-5xl mx-auto">
              <h2 className="text-center text-3xl font-bold mb-3">How it Works</h2>
              <p className="text-center text-stone-500 mb-12">Three simple steps to a seamless lunch</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    className="glass-card p-6 hover:border-orange-500/30 transition-all duration-300 group"
                  >
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {f.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                    <p className="text-stone-400 text-sm leading-relaxed">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="px-6 pb-24">
              <div className="max-w-3xl mx-auto glass-card p-10 text-center border-orange-500/20 glow-orange">
                <h2 className="text-3xl font-bold mb-3">Ready to Order Smarter?</h2>
                <p className="text-stone-400 mb-8">Join hundreds of students already using MealMate at campus.</p>
                <button
                  onClick={() => navigate('/signup')}
                  className="btn-primary px-10 py-4 text-lg"
                >
                  Get Started — It's Free
                </button>
              </div>
            </section>
          </div>
        )}

        {activePage === 'about' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto px-6 py-24 text-center"
          >
            <h1 className="text-5xl font-bold mb-6">About <span className="gradient-text">MealMate</span></h1>
            <div className="space-y-6 text-stone-400 text-left glass-card p-8">
              <p>
                MealMate is a comprehensive canteen management system designed to streamline food service in educational institutions. Pre-order your lunch, skip the queue, and pay at the counter with your unique order code.
              </p>
              <p>
                Admins can manage the full menu in real-time — add items, update stock, approve orders, and view analytics. Students get a seamless ordering experience with live order status.
              </p>
              <p>
                Built with React, Node.js, and MongoDB — MealMate is fast, reliable, and scales with your campus.
              </p>
            </div>
          </motion.div>
        )}

        {activePage === 'contact' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto px-6 py-24 text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Contact <span className="gradient-text">Us</span></h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 text-left">
                <h3 className="font-bold mb-4 text-orange-400">📬 Contact Info</h3>
                <ul className="space-y-2 text-stone-400 text-sm">
                  <li>📧 support@mealmate.campus</li>
                  <li>📞 +91 98765 43210</li>
                  <li>📍 Campus Canteen Block B</li>
                  <li>🕐 Mon–Sat, 8am–6pm</li>
                </ul>
              </div>
              <div className="glass-card p-6 text-left">
                <h3 className="font-bold mb-4 text-orange-400">🌐 Social Media</h3>
                <ul className="space-y-2 text-stone-400 text-sm">
                  <li>Instagram: @mealmate_campus</li>
                  <li>Twitter: @MealMate</li>
                  <li>LinkedIn: MealMate Campus</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-8 py-6 text-center text-stone-600 text-sm">
        © 2025 MealMate — Campus Cafe Management System
      </footer>
    </div>
  );
};

export default LandingPage;