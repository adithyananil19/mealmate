import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Hot Dishes', 'Cold Dishes', 'Soup', 'Grill', 'Appetizer', 'Dessert'];

const statusConfig = {
  pending:   { label: 'Pending',   cls: 'badge-pending',  dot: 'bg-amber-400'  },
  approved:  { label: 'Approved',  cls: 'badge-approved', dot: 'bg-green-400'  },
  paid:      { label: 'Paid',      cls: 'badge-paid',     dot: 'bg-blue-400'   },
  completed: { label: 'Completed', cls: 'badge-paid',     dot: 'bg-blue-400'   },
  rejected:  { label: 'Rejected',  cls: 'badge-rejected', dot: 'bg-red-400'    },
  closed:    { label: 'Cancelled', cls: 'badge-closed',   dot: 'bg-stone-500'  },
};

// ── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color }) => (
  <div className="glass-card p-5">
    <div className={`text-2xl mb-3`}>{icon}</div>
    <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
    <div className="text-sm text-stone-500">{label}</div>
  </div>
);

// ── Sidebar Link ─────────────────────────────────────────────────────────────
const SidebarLink = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-400 border border-orange-500/20'
        : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

// ── Main Component ───────────────────────────────────────────────────────────
const AdminPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [orderTab, setOrderTab] = useState('pending');
  const [inventoryTab, setInventoryTab] = useState('list');
  const [orders, setOrders] = useState([]);
  const [meals, setMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  // Counter state
  const [counterCode, setCounterCode] = useState('');
  const [counterOrder, setCounterOrder] = useState(null);
  const [counterLoading, setCounterLoading] = useState(false);
  const [counterPaying, setCounterPaying] = useState(false);

  // New meal form
  const [newMeal, setNewMeal] = useState({
    name: '', price: '', stock: '', category: 'Hot Dishes', description: '', onMenu: true, photo: null
  });
  const [addingMeal, setAddingMeal] = useState(false);

  const getToken = () => localStorage.getItem('token');

  // ── Auth Check ────────────────────────────────────────────────────────────
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) { navigate('/login'); return; }
    const parsed = JSON.parse(user);
    if (!parsed.isAdmin) { navigate('/menu'); return; }
    setAdminData(parsed);
  }, [navigate]);

  // ── Fetch Data ────────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get('/api/orders', { headers: { 'x-auth-token': getToken() } });
      setOrders(res.data);
    } catch (err) {
      if (err.response?.status === 403) toast.error('Not authorized as admin');
      else toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMeals = useCallback(async () => {
    try {
      const res = await axios.get('/api/meals');
      setMeals(res.data);
    } catch {
      toast.error('Failed to load meals');
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchMeals();
  }, [fetchOrders, fetchMeals]);

  // ── Order Actions ─────────────────────────────────────────────────────────
  const updateOrderStatus = async (orderId, status) => {
    const toastId = toast.loading(`Updating order...`);
    try {
      const res = await axios.patch(`/api/orders/admin/${orderId}`, { status }, {
        headers: { 'x-auth-token': getToken() }
      });
      setOrders(prev => prev.map(o => o._id === orderId ? res.data : o));
      toast.success(
        status === 'approved' ? `Order approved! Code: ${res.data.qrToken}` :
        status === 'rejected' ? 'Order rejected' :
        'Order updated',
        { id: toastId, duration: 4000 }
      );
    } catch {
      toast.error('Failed to update order', { id: toastId });
    }
  };

  // ── Meal Actions ──────────────────────────────────────────────────────────
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMeal(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!newMeal.name || !newMeal.price || !newMeal.stock) {
      toast.error('Fill all required fields');
      return;
    }
    setAddingMeal(true);
    try {
      const res = await axios.post('/api/meals', {
        ...newMeal,
        price: parseFloat(newMeal.price),
        stock: parseInt(newMeal.stock),
      }, { headers: { 'x-auth-token': getToken() } });
      setMeals(prev => [...prev, res.data.meal]);
      setNewMeal({ name: '', price: '', stock: '', category: 'Hot Dishes', description: '', onMenu: true, photo: null });
      toast.success(`"${res.data.meal.name}" added to menu! 🍽️`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add meal');
    } finally {
      setAddingMeal(false);
    }
  };

  const handleDeleteMeal = async (mealId, mealName) => {
    if (!window.confirm(`Delete "${mealName}"?`)) return;
    try {
      await axios.delete(`/api/meals/${mealId}`, { headers: { 'x-auth-token': getToken() } });
      setMeals(prev => prev.filter(m => m._id !== mealId));
      toast.success(`"${mealName}" deleted`);
    } catch {
      toast.error('Failed to delete meal');
    }
  };

  const handleToggleMenu = async (meal) => {
    try {
      const res = await axios.put(`/api/meals/${meal._id}`, { onMenu: !meal.onMenu }, {
        headers: { 'x-auth-token': getToken() }
      });
      setMeals(prev => prev.map(m => m._id === meal._id ? res.data : m));
      toast.success(`${meal.name} ${!meal.onMenu ? 'added to' : 'removed from'} menu`);
    } catch {
      toast.error('Failed to update meal');
    }
  };

  const handleUpdateStock = async (meal, delta) => {
    const newStock = Math.max(0, (meal.stock || 0) + delta);
    try {
      const res = await axios.put(`/api/meals/${meal._id}`, { stock: newStock }, {
        headers: { 'x-auth-token': getToken() }
      });
      setMeals(prev => prev.map(m => m._id === meal._id ? res.data : m));
    } catch {
      toast.error('Failed to update stock');
    }
  };

  // ── Counter Logic ─────────────────────────────────────────────────────────
  const handleCounterLookup = async () => {
    if (!counterCode.trim()) { toast.error('Enter an order code'); return; }
    setCounterLoading(true);
    setCounterOrder(null);
    try {
      const res = await axios.get(`/api/orders/counter/${counterCode.trim().toUpperCase()}`, {
        headers: { 'x-auth-token': getToken() }
      });
      setCounterOrder(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order not found');
    } finally {
      setCounterLoading(false);
    }
  };

  const handleMarkPaid = async () => {
    if (!counterOrder) return;
    setCounterPaying(true);
    try {
      await axios.patch(`/api/orders/counter/${counterOrder.code}/pay`, { paymentMethod: 'cash' }, {
        headers: { 'x-auth-token': getToken() }
      });
      toast.success('✅ Payment confirmed! Order marked as paid.', { duration: 4000 });
      setCounterOrder(prev => ({ ...prev, status: 'paid' }));
      fetchOrders(); // Refresh order list
      fetchMeals(); // Refresh stock inventory
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setCounterPaying(false);
    }
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = {
    pending:  orders.filter(o => o.status === 'pending').length,
    approved: orders.filter(o => o.status === 'approved').length,
    paid:     orders.filter(o => o.status === 'paid').length,
    total:    orders.length,
  };

  // ── Filtered Orders ───────────────────────────────────────────────────────
  const filteredOrders = orders.filter(o => {
    const matchTab = o.status === orderTab;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || (
      o.userId?.name?.toLowerCase().includes(q) ||
      o.userId?.universityId?.toLowerCase().includes(q) ||
      o.qrToken?.toLowerCase().includes(q)
    );
    return matchTab && matchSearch;
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // ── Render Dashboard ──────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Dashboard</h2>
        <p className="text-stone-500 text-sm">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="⏳" label="Pending Orders" value={stats.pending} color="text-amber-400" />
        <StatCard icon="✅" label="Approved Orders" value={stats.approved} color="text-green-400" />
        <StatCard icon="💰" label="Paid Orders" value={stats.paid} color="text-blue-400" />
        <StatCard icon="📋" label="Total Today" value={stats.total} color="text-orange-400" />
      </div>

      {/* Recent pending orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-stone-200">Pending Orders</h3>
          <button onClick={() => setActiveSection('orders')} className="text-sm text-orange-400 hover:text-orange-300">
            View all →
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="glass-card h-20 animate-pulse" />)}
          </div>
        ) : orders.filter(o => o.status === 'pending').length === 0 ? (
          <div className="glass-card p-8 text-center text-stone-500">
            <div className="text-4xl mb-2">🎉</div>
            No pending orders right now
          </div>
        ) : (
          <div className="space-y-3">
            {orders.filter(o => o.status === 'pending').slice(0, 5).map(order => (
              <div key={order._id} className="glass-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{order.userId?.name || 'Student'}</p>
                  <p className="text-xs text-stone-500">{order.userId?.universityId} • {order.cart?.length} item(s) • ₹{order.totalPrice?.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateOrderStatus(order._id, 'approved')}
                    className="px-3 py-1.5 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg text-xs font-semibold hover:bg-green-500/30 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateOrderStatus(order._id, 'rejected')}
                    className="px-3 py-1.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ── Render Orders ─────────────────────────────────────────────────────────
  const renderOrders = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, ID, code..."
            className="input-field pl-9 py-2.5 w-64 text-sm"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-sm">🔍</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-900 rounded-xl p-1 w-fit">
        {['pending', 'approved', 'rejected', 'paid'].map(tab => (
          <button
            key={tab}
            onClick={() => setOrderTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
              orderTab === tab
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {tab}
            <span className="ml-2 text-xs opacity-70">
              ({orders.filter(o => o.status === tab).length})
            </span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="glass-card h-36 animate-pulse" />)}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="glass-card p-12 text-center text-stone-500">
          <div className="text-5xl mb-3">📭</div>
          No {orderTab} orders {searchQuery && `matching "${searchQuery}"`}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const cfg = statusConfig[order.status] || { label: order.status, cls: 'badge-closed' };
            return (
              <div key={order._id} className="glass-card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-bold text-sm">
                        {(order.userId?.name || 'S').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-stone-100">{order.userId?.name || 'Student'}</p>
                        <p className="text-xs text-stone-500">{order.userId?.universityId}</p>
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 mt-1">
                      {new Date(order.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={cfg.cls}>{cfg.label}</span>
                    <p className="font-bold text-xl text-white mt-2">₹{order.totalPrice?.toFixed(2)}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-stone-800/50 rounded-xl p-3 mb-4 space-y-2">
                  {order.cart?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-stone-300">
                        {item.mealId?.name || `Item ${idx + 1}`} × {item.quantity}
                      </span>
                      <span className="text-stone-400">
                        {item.mealId?.price ? `₹${(item.mealId.price * item.quantity).toFixed(2)}` : ''}
                      </span>
                    </div>
                  ))}
                </div>

                {/* QR token display */}
                {order.qrToken && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-4 flex items-center justify-between">
                    <span className="text-xs text-green-400 font-medium">Order Code</span>
                    <span className="font-mono font-black text-2xl tracking-widest text-white">{order.qrToken}</span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 flex-wrap">
                  {order.status === 'pending' && (
                    <>
                      <button onClick={() => updateOrderStatus(order._id, 'approved')}
                        className="px-4 py-2 bg-green-500/20 text-green-300 border border-green-500/30 rounded-xl text-sm font-semibold hover:bg-green-500/30 transition-colors">
                        ✓ Approve & Generate Code
                      </button>
                      <button onClick={() => updateOrderStatus(order._id, 'rejected')}
                        className="px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl text-sm font-semibold hover:bg-red-500/30 transition-colors">
                        ✗ Reject
                      </button>
                    </>
                  )}
                  {order.status === 'approved' && (
                    <button onClick={() => { setActiveSection('counter'); setCounterCode(order.qrToken); }}
                      className="px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl text-sm font-semibold hover:bg-blue-500/30 transition-colors">
                      💳 Go to Counter
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── Render Counter ────────────────────────────────────────────────────────
  const renderCounter = () => (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-2">Counter Payment</h2>
      <p className="text-stone-500 text-sm mb-8">Enter the 6-character order code shown by the student to process payment.</p>

      {/* Code input */}
      <div className="glass-card p-6 mb-6">
        <label className="block text-sm font-medium text-stone-300 mb-3">Order Code</label>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="e.g. A3X9KP"
            className="input-field font-mono text-2xl font-bold tracking-widest uppercase text-center flex-1"
            value={counterCode}
            maxLength={6}
            onChange={e => { setCounterCode(e.target.value.toUpperCase()); setCounterOrder(null); }}
            onKeyDown={e => e.key === 'Enter' && handleCounterLookup()}
            id="counter-code-input"
          />
          <button
            onClick={handleCounterLookup}
            disabled={counterLoading}
            className="btn-primary px-6 shrink-0"
          >
            {counterLoading ? '...' : 'Look Up'}
          </button>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {counterOrder && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="glass-card p-6 border-orange-500/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-bold text-lg">
                  {(counterOrder.userName || 'S').charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-lg">{counterOrder.userName}</p>
                  <p className="text-sm text-stone-500">{counterOrder.universityId}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-3xl font-black text-orange-400 tracking-widest">
                  {counterOrder.code}
                </div>
                <span className={counterOrder.status === 'paid' ? 'badge-paid' : 'badge-approved'}>
                  {counterOrder.status === 'paid' ? 'Already Paid' : 'Ready to Pay'}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="bg-stone-800/50 rounded-xl p-4 mb-5">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Order Items</p>
              <div className="space-y-2">
                {counterOrder.cart?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-stone-300">{item.mealName} × {item.quantity}</span>
                    <span className="text-stone-400">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/5 pt-3 mt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="gradient-text">₹{counterOrder.total?.toFixed(2)}</span>
              </div>
            </div>

            {counterOrder.status === 'paid' ? (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center text-blue-300 font-semibold">
                ✅ This order has already been paid
              </div>
            ) : (
              <button
                onClick={handleMarkPaid}
                disabled={counterPaying}
                className="btn-primary w-full py-4 text-lg"
                id="mark-paid-btn"
              >
                {counterPaying ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : `Confirm Payment — ₹${counterOrder.total?.toFixed(2)}`}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ── Render Inventory ──────────────────────────────────────────────────────
  const renderInventory = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Menu & Inventory</h2>
        <div className="flex gap-1 bg-stone-900 rounded-xl p-1">
          {['list', 'add'].map(t => (
            <button key={t} onClick={() => setInventoryTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                inventoryTab === t
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {t === 'list' ? 'All Items' : '+ Add New'}
            </button>
          ))}
        </div>
      </div>

      {inventoryTab === 'add' ? (
        <div className="glass-card p-6 max-w-xl">
          <h3 className="font-bold text-lg mb-5">Add New Menu Item</h3>
          <form onSubmit={handleAddMeal} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Item Name *</label>
                <input type="text" className="input-field" placeholder="e.g. Butter Chicken" required
                  value={newMeal.name} onChange={e => setNewMeal({...newMeal, name: e.target.value})} id="meal-name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Category *</label>
                <select className="input-field" value={newMeal.category}
                  onChange={e => setNewMeal({...newMeal, category: e.target.value})} id="meal-category">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Price (₹) *</label>
                <input type="number" step="0.01" min="0" className="input-field" placeholder="0.00" required
                  value={newMeal.price} onChange={e => setNewMeal({...newMeal, price: e.target.value})} id="meal-price" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-2">Initial Stock *</label>
                <input type="number" min="0" className="input-field" placeholder="0" required
                  value={newMeal.stock} onChange={e => setNewMeal({...newMeal, stock: e.target.value})} id="meal-stock" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Description (optional)</label>
              <textarea rows={2} className="input-field resize-none" placeholder="Short description..."
                value={newMeal.description} onChange={e => setNewMeal({...newMeal, description: e.target.value})} id="meal-description" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-2">Photo (optional, max 2MB)</label>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500/20 file:text-orange-400 hover:file:bg-orange-500/30" />
              {newMeal.photo && (
                <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden border border-white/10">
                  <img src={newMeal.photo} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setNewMeal({...newMeal, photo: null})} className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-500 transition-colors">×</button>
                </div>
              )}
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="accent-orange-500" checked={newMeal.onMenu}
                onChange={e => setNewMeal({...newMeal, onMenu: e.target.checked})} id="meal-on-menu" />
              <span className="text-sm text-stone-300">Show on menu immediately</span>
            </label>
            <button type="submit" disabled={addingMeal} className="btn-primary w-full py-3" id="add-meal-btn">
              {addingMeal ? 'Adding...' : '+ Add Item to Menu'}
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {meals.length === 0 ? (
            <div className="col-span-full glass-card p-12 text-center text-stone-500">
              <div className="text-5xl mb-3">🍽️</div>
              No meals yet. Add your first item!
            </div>
          ) : meals.map(meal => (
            <div key={meal._id} className="glass-card p-4 flex flex-col">
              <div className="w-full h-28 rounded-xl bg-stone-800 flex items-center justify-center text-4xl mb-3">
                {meal.photo ? <img src={meal.photo} alt={meal.name} className="w-full h-full object-cover rounded-xl" /> :
                  { 'Hot Dishes': '🍜', 'Cold Dishes': '🥗', 'Soup': '🍲', 'Grill': '🥩', 'Appetizer': '🧆', 'Dessert': '🍰' }[meal.category] || '🍽️'
                }
              </div>
              <p className="text-xs text-orange-400 mb-1">{meal.category}</p>
              <p className="font-semibold text-stone-100 text-sm mb-1 line-clamp-2">{meal.name}</p>
              <p className="font-bold text-white mb-2">₹{meal.price?.toFixed(2)}</p>

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-stone-400">Stock: <span className={meal.stock > 0 ? 'text-green-400' : 'text-red-400'}>{meal.stock || 0}</span></span>
                <div className="flex gap-1">
                  <button onClick={() => handleUpdateStock(meal, -1)} disabled={!meal.stock}
                    className="w-7 h-7 rounded-lg bg-stone-700 hover:bg-stone-600 text-white text-sm font-bold transition-colors disabled:opacity-30">−</button>
                  <button onClick={() => handleUpdateStock(meal, 1)}
                    className="w-7 h-7 rounded-lg bg-orange-500/30 hover:bg-orange-500/50 text-orange-300 text-sm font-bold transition-colors">+</button>
                </div>
              </div>

              <div className="mt-auto flex gap-2">
                <button onClick={() => handleToggleMenu(meal)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                    meal.onMenu
                      ? 'bg-green-500/10 text-green-300 border-green-500/30 hover:bg-green-500/20'
                      : 'bg-stone-700/50 text-stone-400 border-stone-600/30 hover:bg-stone-700'
                  }`}>
                  {meal.onMenu ? '✓ On Menu' : '＋ Show'}
                </button>
                <button onClick={() => handleDeleteMeal(meal._id, meal.name)}
                  className="px-2 py-1.5 rounded-lg text-xs text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors">
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const pendingCount = orders.filter(o => o.status === 'pending').length;

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
      <aside className="w-64 bg-stone-900/50 border-r border-white/5 flex flex-col shrink-0">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-lg font-bold">
              M
            </div>
            <div>
              <div className="font-bold">MealMate Admin</div>
              <div className="text-xs text-orange-400 font-semibold">ADMIN PANEL</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink icon="📊" label="Dashboard" active={activeSection === 'dashboard'} onClick={() => setActiveSection('dashboard')} />
          <SidebarLink icon="📋" label="Order Management" active={activeSection === 'orders'} badge={pendingCount} onClick={() => setActiveSection('orders')} />
          <SidebarLink icon="💳" label="Counter" active={activeSection === 'counter'} onClick={() => setActiveSection('counter')} />
          <SidebarLink icon="🍽️" label="Menu & Inventory" active={activeSection === 'inventory'} onClick={() => setActiveSection('inventory')} />
        </nav>

        <div className="p-4 border-t border-white/5">
          {adminData && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center font-bold text-sm">
                {(adminData.name || 'A').charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-stone-100 truncate">{adminData.name}</p>
                <p className="text-xs text-orange-400 font-semibold">Admin</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout}
            className="w-full text-xs text-stone-500 hover:text-red-400 transition-colors flex items-center gap-2 px-2 py-1">
            ↩ Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === 'dashboard'  && renderDashboard()}
            {activeSection === 'orders'     && renderOrders()}
            {activeSection === 'counter'    && renderCounter()}
            {activeSection === 'inventory'  && renderInventory()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminPage;