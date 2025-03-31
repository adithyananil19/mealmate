import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Make sure to install axios

const MenuPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Hot Dishes');
  const [activePage, setActivePage] = useState('Home');
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [tokenHistory, setTokenHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inventory, setInventory] = useState([
    {
      id: 1,
      name: 'Spicy seasoned seafood noodles',
      price: 2.29,
      image: '/api/placeholder/150/150',
      category: 'Hot Dishes',
      available: 15
    },
    {
      id: 2,
      name: 'Salted Pasta with mushroom sauce',
      price: 2.69,
      image: '/api/placeholder/150/150',
      category: 'Hot Dishes',
      available: 20
    },
    {
      id: 3,
      name: 'Beef dumpling in hot and sour soup',
      price: 2.99,
      image: '/api/placeholder/150/150',
      category: 'Hot Dishes',
      available: 12
    },
    {
      id: 4,
      name: 'Healthy noodle with spinach leaf',
      price: 3.29,
      image: '/api/placeholder/150/150',
      category: 'Hot Dishes',
      available: 22
    },
    {
      id: 5,
      name: 'Hot spicy fried rice with omelet',
      price: 3.49,
      image: '/api/placeholder/150/150',
      category: 'Hot Dishes',
      available: 18
    },
    {
      id: 6,
      name: 'Spicy instant noodle with special omelette',
      price: 3.59,
      image: '/api/placeholder/150/150',
      category: 'Hot Dishes',
      available: 8
    },
    {
      id: 7,
      name: 'Hot spicy fried rice with omelet',
      price: 3.49,
      image: '/api/placeholder/150/150',
      category: 'Hot Dishes',
      available: 14
    },
    {
      id: 8,
      name: 'Healthy noodle with spinach leaf',
      price: 3.29,
      image: '/api/placeholder/150/150',
      category: 'Hot Dishes',
      available: 16
    }
  ]);
  
  // Updated useEffect to better handle login status and fetch user's order history
  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Stored user object:", parsedUser);
      setIsLoggedIn(true);
      setUserData(parsedUser);
      
      // Fetch the user's order history
      fetchUserOrders(parsedUser._id);
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
    
    // Add an event listener to check for login changes
    const checkLoginStatus = () => {
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        setIsLoggedIn(true);
        setUserData(parsedUser);
        fetchUserOrders(parsedUser._id);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };
    
    // Listen for storage changes (in case login happens in another tab)
    window.addEventListener('storage', checkLoginStatus);
    
    // Custom event for login status changes within the same tab
    window.addEventListener('loginStatusChanged', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStatusChanged', checkLoginStatus);
    };
  }, []);
  
  // Function to fetch user's order history
  const fetchUserOrders = async (userId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/orders/user/${userId}`);
      
      // Transform the order data to match our token history format
      const formattedOrders = response.data.map(order => {
        // Get the first item name for display (or combine multiple item names)
        const primaryDishName = order.cart.length > 0 
          ? inventory.find(item => item.id.toString() === order.cart[0].mealId.toString())?.name || 'Unknown dish'
          : 'Unknown dish';
        
        // Format for token history
        return {
          id: order._id,
          dishName: primaryDishName,
          date: new Date(order.createdAt).toISOString().split('T')[0],
          status: order.status,
          tokenNumber: `T${order._id.substr(-3)}`, // Last 3 chars of order ID
          order: order // Keep the full order for reference
        };
      });
      
      // Sort by date, newest first
      formattedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setTokenHistory(formattedOrders);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setIsLoading(false);
    }
  };
  
  const categories = ['Hot Dishes', 'Cold Dishes', 'Soup', 'Grill', 'Appetizer', 'Dessert'];
  
  const dishes = inventory.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    category: item.category,
    available: item.available
  }));
  
  // Updated handleLogin function
  const handleLogin = () => {
    // Store current page to redirect back after login
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    navigate("/login");
  };
  
  // Updated handleLogout function
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserData(null);
    setTokenHistory([]);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('loginStatusChanged'));
  };
  
  const addToCart = (dish) => {
    // Check if item is available
    const inventoryItem = inventory.find(item => item.id === dish.id);
    if (inventoryItem.available <= 0) {
      alert("Sorry, this item is out of stock");
      return;
    }
    
    const existingItem = cart.find(item => item.id === dish.id);
    
    if (existingItem) {
      // Check if we're not exceeding available quantity
      if (existingItem.quantity >= inventoryItem.available) {
        alert(`Sorry, only ${inventoryItem.available} items available`);
        return;
      }
      
      setCart(cart.map(item => 
        item.id === dish.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...dish, quantity: 1 }]);
    }
    
    // Show a quick toast notification
    alert(`Added ${dish.name} to cart`);
  };
  
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };
  
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    
    // Check inventory
    const inventoryItem = inventory.find(item => item.id === id);
    if (newQuantity > inventoryItem.available) {
      alert(`Sorry, only ${inventoryItem.available} items available`);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };
  
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // New function to handle checkout
  const handleCheckout = async () => {
    if (!isLoggedIn) {
      alert("Please login to checkout");
      handleLogin();
      return;
    }
    
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Get the stored user data
      const storedUser = localStorage.getItem('user');
      const userObj = JSON.parse(storedUser);
      
      // Check if token exists
      if (!userObj.token) {
        alert("Session expired. Please login again.");
        handleLogout();
        handleLogin();
        return;
      }
      
      // Format cart items
      const formattedCart = cart.map(item => ({
        mealId: item.id,
        quantity: item.quantity
      }));
      
      // Create order object
      const order = {
        userId: userData._id,
        cart: formattedCart,
        totalPrice: calculateTotal(),
        status: "pending",
        paymentMethod: null,
      };
      
      console.log("Sending order:", order);
      console.log("With token:", userObj.token);
      
      // Send order to backend with auth token
      const response = await axios.post('/api/orders', order, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': userObj.token
        }
      });
      
      console.log("Order response:", response.data);

      if (response.data && response.data._id) {
        // Add the new order to token history
        const newOrder = response.data;
        
        // Get the first item name for display
        const primaryDishName = newOrder.cart.length > 0
          ? inventory.find(item => item.id.toString() === newOrder.cart[0].mealId.toString())?.name || 'Unknown dish'
          : 'Unknown dish';
        
        const newToken = {
          id: newOrder._id,
          dishName: primaryDishName,
          date: new Date().toISOString().split('T')[0],
          status: "pending",
          tokenNumber: `T${newOrder._id.substr(-3)}`, // Last 3 chars of order ID
          order: newOrder // Keep the full order for reference
        };
        
        // Update token history
        setTokenHistory([newToken, ...tokenHistory]);
        
        // Clear cart
        setCart([]);
        
        // Show success message
        alert("Order placed successfully! Check your tokens for status updates.");
        
        // Navigate to tokens page
        setActivePage('Tokens');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error placing order:', error);
      
      // Enhanced error handling
      if (error.response) {
        console.log("Error status:", error.response.status);
        console.log("Error data:", error.response.data);
        
        if (error.response.status === 401) {
          alert("Your session has expired. Please login again.");
          handleLogout();
          handleLogin();
        } else {
          alert(`Order failed: ${error.response.data.message || 'Unknown server error'}`);
        }
      } else {
        alert("Failed to place order. Network or server issue.");
      }
      
      setIsLoading(false);
    }
  };

  // Function to handle order cancellation
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Send cancellation request to backend
      await axios.patch(`/api/orders/${orderId}`, { status: "closed" });
      
      // Update token history
      setTokenHistory(tokenHistory.map(token => 
        token.id === orderId 
          ? { ...token, status: "closed" } 
          : token
      ));
      
      setIsLoading(false);
      alert("Order cancelled successfully");
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert("Failed to cancel order. Please try again.");
      setIsLoading(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'paid':
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const renderHomePage = () => {
    return (
      <>
        {/* Category tabs */}
        <div className="px-6 border-b">
          <div className="flex space-x-6 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                className={`pb-4 px-1 whitespace-nowrap ${activeCategory === category ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-500'}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Dishes section */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Choose Dishes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dishes.map(dish => (
              <div key={dish.id} className="bg-orange-200 rounded-lg p-4 flex flex-col items-center relative">
                <img 
                  src={dish.image} 
                  alt={dish.name}
                  className="w-32 h-32 rounded-full object-cover mb-2"
                />
                <h3 className="text-center text-sm font-medium">{dish.name}</h3>
                <p className="mt-1 font-bold">${dish.price.toFixed(2)}</p>
                <p className="text-sm text-gray-600 mb-2">
                  {dish.available > 0 ? `${dish.available} available` : 'Out of stock'}
                </p>
                <button 
                  onClick={() => addToCart(dish)}
                  disabled={dish.available <= 0}
                  className={`mt-1 py-1 px-4 rounded-lg text-sm ${dish.available > 0 
                    ? 'bg-orange-400 hover:bg-orange-500 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };
  
  const renderTodaysOrder = () => {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Today's Order</h2>
        
        {cart.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>Your cart is empty. Add some dishes to get started!</p>
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Item</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Quantity</th>
                    <th className="py-3 px-4 text-left">Total</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.id} className="border-t border-gray-200">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-12 h-12 rounded-full object-cover mr-3"
                          />
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">${item.price.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-200 px-2 rounded-l"
                          >
                            -
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-200 px-2 rounded-r"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between border-b pb-4">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-4">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={isLoading}
                className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-orange-400 hover:bg-orange-500'} text-white py-2 rounded-lg mt-4`}
              >
                {isLoading ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderTokensPage = () => {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Token History</h2>
          <div className="bg-orange-100 text-orange-800 py-1 px-3 rounded-full text-sm">
            User Tokens
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">
            <p>Loading token history...</p>
          </div>
        ) : tokenHistory.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>You haven't used any tokens yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Token #</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Item</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tokenHistory.map(token => {
                  const statusClass = getStatusColor(token.status);
                  
                  return (
                    <tr key={token.id} className="border-t border-gray-200">
                      <td className="py-4 px-4 font-medium">{token.tokenNumber}</td>
                      <td className="py-4 px-4">
                        {new Date(token.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-4">{token.dishName}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                          {token.status.charAt(0).toUpperCase() + token.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button 
                          onClick={() => handleViewOrder(token.id)}
                          className="text-blue-500 hover:text-blue-700 mr-3"
                        >
                          View
                        </button>
                        {(token.status === 'waiting' || token.status === 'pending') && (
                          <button 
                            onClick={() => handleCancelOrder(token.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Cancel
                          </button>
                        )}
                        {token.status === 'approved' && !token.order.qrToken && (
                          <button 
                            onClick={() => handleViewQR(token.id)}
                            className="text-green-500 hover:text-green-700"
                          >
                            QR Code
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };
  
  // Function to handle viewing order details
  const handleViewOrder = (orderId) => {
    // Get the order by ID
    const order = tokenHistory.find(token => token.id === orderId)?.order;
    
    if (!order) {
      alert("Order details not found");
      return;
    }
    
    // Show order details (can be enhanced to show in a modal)
    alert(`
      Order Details:
      Total Price: $${order.totalPrice.toFixed(2)}
      Status: ${order.status}
      Created: ${new Date(order.createdAt).toLocaleString()}
      ${order.paymentTime ? `Paid: ${new Date(order.paymentTime).toLocaleString()}` : ''}
    `);
  };
  
  // Function to handle viewing QR code
  const handleViewQR = (orderId) => {
    // Get the order by ID
    const order = tokenHistory.find(token => token.id === orderId)?.order;
    
    if (!order || !order.qrToken) {
      alert("QR code not available yet");
      return;
    }
    
    // Show QR code (can be enhanced to show actual QR code in a modal)
    alert(`QR Code: ${order.qrToken}`);
  };
  
  const renderContent = () => {
    switch(activePage) {
      case 'Home':
        return renderHomePage();
      case "Today's Order":
        return renderTodaysOrder();
      case 'Tokens':
        return renderTokensPage();
      default:
        return renderHomePage();
    }
  };

  // User profile component
  const UserProfile = ({ userData }) => {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center overflow-hidden border-2 border-yellow-300">
          <img 
            src="/api/placeholder/40/40" 
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-sm">{userData.name}</span>
          <span className="text-xs text-gray-500">{userData.uniId}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 flex items-center space-x-2">
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="black">
            <circle cx="12" cy="12" r="10" fill="black" />
            <path d="M8 12 L16 12 M12 8 L12 16" stroke="white" strokeWidth="2" />
          </svg>
          <span className="font-bold text-lg">CAMPUS CAFE</span>
        </div>
        
        <div className="mt-8">
          <button 
            className={`w-full px-4 py-3 flex items-center space-x-3 ${activePage === 'Home' ? 'text-orange-400' : 'text-gray-500'}`}
            onClick={() => setActivePage('Home')}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeWidth="2" />
            </svg>
            <span>Home Page</span>
          </button>
          
          <button 
            className={`w-full px-4 py-3 flex items-center space-x-3 ${activePage === "Today's Order" ? 'text-orange-400' : 'text-gray-500'}`}
            onClick={() => setActivePage("Today's Order")}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" />
            </svg>
            <span>Today's Order</span>
            {cart.length > 0 && (
              <span className="ml-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          
          <button 
            className={`w-full px-4 py-3 flex items-center space-x-3 ${activePage === 'Tokens' ? 'text-orange-400' : 'text-gray-500'}`}
            onClick={() => setActivePage('Tokens')}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path d="M12 6v6l4 2" strokeWidth="2" />
            </svg>
            <span>Tokens</span>
          </button>
        </div>
        
        {/* Add logout button at bottom of sidebar if logged in */}
        {isLoggedIn && (
          <div className="mt-auto p-4 border-t">
            <button 
              onClick={handleLogout}
              className="w-full px-4 py-2 flex items-center space-x-3 text-gray-500 hover:text-red-500"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeWidth="2" />
                <path d="M16 17l5-5-5-5" strokeWidth="2" />
                <path d="M21 12H9" strokeWidth="2" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-between items-center p-6">
          <div>
            <h1 className="text-2xl font-semibold">Jaegar Resto</h1>
            <p className="text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          {/* Display login button or user profile based on login status */}
          {isLoggedIn && userData ? (
            <div className="flex items-center space-x-4">
              <UserProfile userData={userData} />
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-orange-300 hover:bg-orange-400 text-white py-2 px-6 rounded-lg"
            >
              Login
            </button>
          )}
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default MenuPage;