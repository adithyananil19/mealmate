import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const MenuPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Hot Dishes');
  const [activePage, setActivePage] = useState('Home');
  const [cart, setCart] = useState([]);
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
  
  const categories = ['Hot Dishes', 'Cold Dishes', 'Soup', 'Grill', 'Appetizer', 'Dessert'];
  
  const dishes = inventory.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    category: item.category,
    available: item.available
  }));
  
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
  
  const updateInventoryCount = (id, delta) => {
    setInventory(inventory.map(item => 
      item.id === id 
        ? { ...item, available: Math.max(0, item.available + delta) } 
        : item
    ));
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
              <button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-lg mt-4">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderTokensPage = () => {
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
        
        {/* Inventory Management section */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Inventory Management</h2>
            <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm">Admin Mode</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {inventory.map(dish => (
              <div key={dish.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center relative">
                <img 
                  src={dish.image} 
                  alt={dish.name}
                  className="w-32 h-32 rounded-full object-cover mb-2"
                />
                <h3 className="text-center text-sm font-medium">{dish.name}</h3>
                <p className="mt-1 font-bold">${dish.price.toFixed(2)}</p>
                
                <div className="mt-3 flex items-center bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => updateInventoryCount(dish.id, -1)}
                    disabled={dish.available <= 0}
                    className={`px-3 py-1 rounded ${dish.available > 0 ? 'bg-red-400 text-white' : 'bg-gray-300 text-gray-500'}`}
                  >
                    -
                  </button>
                  <div className="px-4">
                    <span className="font-bold">{dish.available}</span>
                    <span className="text-xs text-gray-500 block text-center">available</span>
                  </div>
                  <button 
                    onClick={() => updateInventoryCount(dish.id, 1)}
                    className="px-3 py-1 rounded bg-green-400 text-white"
                  >
                    +
                  </button>
                </div>
                
                {dish.available <= 5 && (
                  <div className="mt-2 text-red-500 text-xs font-semibold">
                    {dish.available === 0 ? 'OUT OF STOCK!' : 'LOW STOCK!'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </>
    );
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

  return (
    <div className="flex h-screen bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-60 bg-white border-r border-gray-200">
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
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-between items-center p-6">
          <div>
            <h1 className="text-2xl font-semibold">Jaegar Resto</h1>
            <p className="text-gray-500">Tuesday, 2 Feb 2021</p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="bg-orange-300 hover:bg-orange-400 text-white py-2 px-6 rounded-lg">
            Login
          </button>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default MenuPage;