import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Hot Dishes', 'Cold Dishes', 'Soup', 'Grill', 'Appetizer', 'Dessert'];

const statusConfig = {
  pending:   { label: 'Pending',   cls: 'badge-pending'  },
  approved:  { label: 'Approved',  cls: 'badge-approved' },
  paid:      { label: 'Paid',      cls: 'badge-paid'     },
  completed: { label: 'Completed', cls: 'badge-paid'     },
  rejected:  { label: 'Rejected',  cls: 'badge-rejected' },
  closed:    { label: 'Cancelled', cls: 'badge-closed'   },
  waiting:   { label: 'Waiting',   cls: 'badge-pending'  },
};

// ── Sidebar Nav Item ────────────────────────────────────────────────────────
const NavItem = ({ icon, label, active, badge, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium relative ${
      active
        ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-400 border border-orange-500/20'
        : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
    {badge > 0 && (
      <span className="ml-auto bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
        {badge}
      </span>
    )}
  </button>
);

// ── Meal Card ───────────────────────────────────────────────────────────────
const MealCard = ({ meal, onAdd }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="glass-card p-4 flex flex-col group hover:border-orange-500/30 transition-all duration-300"
  >
    <div className="w-full h-32 rounded-xl bg-gradient-to-br from-stone-800 to-stone-700 flex items-center justify-center mb-4 text-5xl overflow-hidden">
      {meal.photo
        ? <img src={meal.photo} alt={meal.name} className="w-full h-full object-cover rounded-xl" />
        : getCategoryEmoji(meal.category)
      }
    </div>

    <div className="flex-1">
      <p className="text-xs text-orange-400 font-medium mb-1">{meal.category}</p>
      <h3 className="font-semibold text-stone-100 text-sm leading-snug mb-2 line-clamp-2">{meal.name}</h3>
      {meal.description && (
        <p className="text-xs text-stone-500 mb-2 line-clamp-2">{meal.description}</p>
      )}
    </div>

    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
      <div>
        <p className="font-bold text-lg text-white">₹{meal.price.toFixed(2)}</p>
        <p className={`text-xs ${meal.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {meal.stock > 0 ? `${meal.stock} left` : 'Out of stock'}
        </p>
      </div>
      <button
        onClick={() => onAdd(meal)}
        disabled={meal.stock <= 0}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 ${
          meal.stock > 0
            ? 'bg-orange-500 hover:bg-orange-600 text-white'
            : 'bg-stone-700 text-stone-500 cursor-not-allowed'
        }`}
      >
        {meal.stock > 0 ? '+ Add' : 'Sold Out'}
      </button>
    </div>
  </motion.div>
);

function getCategoryEmoji(cat) {
  const map = {
    'Hot Dishes': '🍜', 'Cold Dishes': '🥗', 'Soup': '🍲',
    'Grill': '🥩', 'Appetizer': '🧆', 'Dessert': '🍰'
  };
  return map[cat] || '🍽️';
}

// ── Main Component ──────────────────────────────────────────────────────────
const MenuPage = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('Home');
  const [activeCategory, setActiveCategory] = useState('All');
  const [meals, setMeals] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ── Auth State ────────────────────────────────────────────────────────────
  const checkAuth = useCallback(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUserData(u);
      return u;
    } else {
      setIsLoggedIn(false);
      setUserData(null);
      return null;
    }
  }, []);

  // ── Fetch Meals ───────────────────────────────────────────────────────────
  const fetchMeals = async () => {
    try {
      const res = await axios.get('/api/meals');
      const onMenuMeals = res.data.filter(m => m.onMenu !== false);
      setMeals(onMenuMeals);
    } catch {
      toast.error('Could not load menu. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Fetch Orders ──────────────────────────────────────────────────────────
  const fetchOrders = async (user) => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/orders/user/${user._id}`, {
        headers: { 'x-auth-token': token }
      });
      setOrders(res.data);
    } catch {
      // Not critical — user might not have orders
    }
  };

  useEffect(() => {
    fetchMeals();
    const user = checkAuth();
    if (user) fetchOrders(user);

    const handleAuthChange = () => {
      const u = checkAuth();
      if (u) fetchOrders(u);
    };
    window.addEventListener('loginStatusChanged', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('loginStatusChanged', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [checkAuth]);

  // ── Cart Logic ────────────────────────────────────────────────────────────
  const addToCart = (meal) => {
    const existing = cart.find(i => i._id === meal._id);
    const inCart = existing ? existing.quantity : 0;
    if (inCart >= meal.stock) {
      toast.error(`Only ${meal.stock} available!`);
      return;
    }
    if (existing) {
      setCart(cart.map(i => i._id === meal._id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...meal, quantity: 1 }]);
    }
    toast.success(`${meal.name} added to cart`, { icon: '🛒' });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev
      .map(i => i._id === id ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i._id !== id));
    toast('Item removed', { icon: '🗑️' });
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // ── Checkout ──────────────────────────────────────────────────────────────
  const handleCheckout = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsCheckingOut(true);
    const token = localStorage.getItem('token');

    try {
      const formattedCart = cart.map(i => ({ mealId: i._id, quantity: i.quantity }));
      const res = await axios.post('/api/orders', {
        userId: userData._id,
        cart: formattedCart,
        totalPrice: parseFloat(cartTotal.toFixed(2)),
      }, { headers: { 'x-auth-token': token } });

      setOrders(prev => [res.data, ...prev]);
      setCart([]);
      toast.success('Order placed! Check your tokens tab for updates 🎫', { duration: 4000 });
      setActivePage('Tokens');
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        handleLogout();
      } else {
        toast.error(err.response?.data?.message || 'Failed to place order');
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  // ── Cancel Order ──────────────────────────────────────────────────────────
  const handleCancelOrder = async (orderId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.patch(`/api/orders/${orderId}`, { status: 'closed' }, {
        headers: { 'x-auth-token': token }
      });
      setOrders(prev => prev.map(o => o._id === orderId ? res.data : o));
      toast.success('Order cancelled');
    } catch {
      toast.error('Could not cancel order');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
    setOrders([]);
    window.dispatchEvent(new Event('loginStatusChanged'));
    toast('Logged out', { icon: '👋' });
  };

  // ── Filtered Meals ────────────────────────────────────────────────────────
  const filteredMeals = activeCategory === 'All'
    ? meals
    : meals.filter(m => m.category === activeCategory);

  // ── Render Home ───────────────────────────────────────────────────────────
  const renderHome = () => (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      {/* Category pills */}
      <div className="px-6 pt-6 pb-4 flex gap-2 overflow-x-auto scrollbar-thin">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-white/5 text-stone-400 hover:text-stone-200 hover:bg-white/10 border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Meal grid */}
      <div className="px-6 pb-6">
        <h2 className="text-lg font-bold text-stone-200 mb-4">
          {activeCategory === 'All' ? 'All Items' : activeCategory}
          <span className="ml-2 text-sm font-normal text-stone-500">({filteredMeals.length} items)</span>
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card h-56 animate-pulse" />
            ))}
          </div>
        ) : filteredMeals.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-stone-400">No items in this category yet</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMeals.map(meal => (
                <MealCard key={meal._id} meal={meal} onAdd={addToCart} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );

  // ── Render Cart ───────────────────────────────────────────────────────────
  const renderCart = () => (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
      <div className="max-w-2xl">
        <h2 className="text-xl font-bold mb-6">Your Cart</h2>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-stone-400 mb-4">Your cart is empty</p>
            <button onClick={() => setActivePage('Home')} className="btn-primary px-6 py-3">
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item._id} className="glass-card p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-stone-800 flex items-center justify-center text-2xl shrink-0">
                  {getCategoryEmoji(item.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-100 text-sm truncate">{item.name}</p>
                  <p className="text-orange-400 font-bold">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item._id, -1)}
                    className="w-8 h-8 rounded-lg bg-stone-700 hover:bg-stone-600 text-white font-bold transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item._id, 1)}
                    className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="glass-card p-6 mt-6">
              <div className="flex justify-between text-stone-400 mb-2">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-3 border-t border-white/5 mb-6">
                <span>Total</span>
                <span className="gradient-text">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-4 text-xs text-blue-300">
                💡 Payment is done at the counter. You'll get a unique code when your order is approved.
              </div>
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="btn-primary w-full py-4 text-base"
                id="checkout-btn"
              >
                {isCheckingOut ? 'Placing Order...' : `Place Order — ₹${cartTotal.toFixed(2)}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── Render Tokens ─────────────────────────────────────────────────────────
  const renderTokens = () => (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">My Orders & Tokens</h2>
        <button
          onClick={() => userData && fetchOrders(userData)}
          className="text-sm text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
        >
          ↻ Refresh
        </button>
      </div>

      {!isLoggedIn ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-stone-400 mb-4">Login to view your order history</p>
          <button onClick={() => navigate('/login')} className="btn-primary px-6 py-3">
            Sign In
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎫</div>
          <p className="text-stone-400 mb-2">No orders yet</p>
          <p className="text-stone-600 text-sm mb-6">Place your first order to see it here</p>
          <button onClick={() => setActivePage('Home')} className="btn-primary px-6 py-3">
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const cfg = statusConfig[order.status] || { label: order.status, cls: 'badge-closed' };
            const canCancel = order.status === 'pending' || order.status === 'waiting';
            return (
              <div key={order._id} className="glass-card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-stone-500 mb-1">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                    <p className="font-bold text-white text-lg">₹{order.totalPrice?.toFixed(2)}</p>
                    <p className="text-xs text-stone-500">{order.cart?.length} item(s)</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <span className={cfg.cls}>{cfg.label}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                        className="text-xs text-stone-400 hover:text-white transition-colors"
                      >
                        {selectedOrder?._id === order._id ? 'Hide ▲' : 'Details ▼'}
                      </button>
                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Approved — show the big order code */}
                {(order.status === 'approved') && order.qrToken && (
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5 mt-3 text-center">
                    <p className="text-xs text-green-400 font-semibold tracking-widest uppercase mb-2">
                      🎫 Show this at the counter
                    </p>
                    <div className="font-mono text-5xl font-black tracking-[0.3em] text-white drop-shadow-lg">
                      {order.qrToken}
                    </div>
                    <p className="text-xs text-stone-500 mt-3">Pay at the counter and collect your food</p>
                  </div>
                )}

                {/* Paid confirmation */}
                {order.status === 'paid' && order.qrToken && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mt-3 text-center">
                    <p className="text-xs text-blue-400 font-semibold mb-1">✅ Paid & Collected</p>
                    <p className="font-mono text-2xl font-bold text-stone-400 tracking-widest">{order.qrToken}</p>
                    {order.paymentTime && (
                      <p className="text-xs text-stone-600 mt-1">
                        Paid at {new Date(order.paymentTime).toLocaleTimeString('en-IN')}
                      </p>
                    )}
                  </div>
                )}

                {/* Expandable order details */}
                <AnimatePresence>
                  {selectedOrder?._id === order._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/5 mt-4 pt-4 space-y-2">
                        {order.cart?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-stone-400">
                              {typeof item.mealId === 'object' ? item.mealId?.name : `Item ${idx + 1}`} × {item.quantity}
                            </span>
                            <span className="text-stone-300">
                              {typeof item.mealId === 'object' ? `₹${(item.mealId.price * item.quantity).toFixed(2)}` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── Main Layout ───────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-stone-950 font-outfit overflow-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#292524', color: '#fafaf9', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
          duration: 3000,
        }}
      />

      {/* Sidebar */}
      <aside className="w-60 bg-stone-900/50 border-r border-white/5 flex flex-col shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-lg font-bold shrink-0">
              M
            </div>
            <div>
              <div className="font-bold text-base leading-tight">Campus Cafe</div>
              <div className="text-xs text-stone-500">MealMate System</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <NavItem icon="🏠" label="Browse Menu" active={activePage === 'Home'} onClick={() => setActivePage('Home')} />
          <NavItem icon="🛒" label="Your Cart" active={activePage === 'Cart'} badge={cartCount} onClick={() => setActivePage('Cart')} />
          <NavItem icon="🎫" label="My Tokens" active={activePage === 'Tokens'} onClick={() => setActivePage('Tokens')} />
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/5">
          {isLoggedIn && userData ? (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-bold text-sm shrink-0">
                  {userData.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-stone-100 truncate">{userData.name}</p>
                  <p className="text-xs text-stone-500 truncate">{userData.universityId || userData.uniId}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left text-xs text-stone-500 hover:text-red-400 transition-colors flex items-center gap-2 px-2 py-1"
              >
                <span>↩</span> Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="btn-primary w-full py-2.5 text-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-stone-100">
              {activePage === 'Home' && 'Today\'s Menu'}
              {activePage === 'Cart' && 'Your Cart'}
              {activePage === 'Tokens' && 'Orders & Tokens'}
            </h1>
            <p className="text-sm text-stone-500">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>

          {activePage === 'Home' && (
            <div className="flex items-center gap-2 text-sm text-stone-400">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              {meals.length} items available
            </div>
          )}
        </header>

        {/* Page content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-hidden flex flex-col"
          >
            {activePage === 'Home' && renderHome()}
            {activePage === 'Cart' && renderCart()}
            {activePage === 'Tokens' && renderTokens()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MenuPage;