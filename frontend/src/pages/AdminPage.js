import React, { useState } from 'react';


const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [activeSection, setActiveSection] = useState('orders');
  const [inventoryTab, setInventoryTab] = useState('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Admin user info
  const adminUser = {
    name: "John Doe",
    avatar: "/api/placeholder/40/40"
  };
  
  const [orders, setOrders] = useState([
    {
      id: 1,
      studentName: 'Alex Johnson',
      studentId: 'SID2023001',
      orderTime: '10:30 AM',
      status: 'pending',
      items: [
        { name: 'Spicy seasoned seafood noodles', price: 2.29, quantity: 1 },
        { name: 'Beef dumpling in hot and sour soup', price: 2.99, quantity: 2 }
      ]
    },
    {
      id: 2,
      studentName: 'Sarah Williams',
      studentId: 'SID2023042',
      orderTime: '10:45 AM',
      status: 'pending',
      items: [
        { name: 'Salted Pasta with mushroom sauce', price: 2.69, quantity: 1 },
        { name: 'Healthy noodle with spinach leaf', price: 3.29, quantity: 1 }
      ]
    },
    {
      id: 3,
      studentName: 'Mike Chen',
      studentId: 'SID2023018',
      orderTime: '11:05 AM',
      status: 'pending',
      items: [
        { name: 'Hot spicy fried rice with omelet', price: 3.49, quantity: 2 }
      ]
    },
    {
      id: 4,
      studentName: 'Emily Davis',
      studentId: 'SID2023025',
      orderTime: '9:15 AM',
      status: 'accepted',
      items: [
        { name: 'Healthy noodle with spinach leaf', price: 3.29, quantity: 1 },
        { name: 'Spicy instant noodle with special omelette', price: 3.59, quantity: 1 }
      ]
    },
    {
      id: 5,
      studentName: 'Tom Wilson',
      studentId: 'SID2023037',
      orderTime: '10:10 AM',
      status: 'rejected',
      items: [
        { name: 'Hot spicy fried rice with omelet', price: 3.49, quantity: 1 }
      ]
    }
  ]);

  const [inventoryItems, setInventoryItems] = useState([
    { id: 1, name: 'Spicy seasoned seafood noodles', price: 2.29, stock: 15, category: 'Hot Dishes', image: '/api/placeholder/80/80', onMenu: true },
    { id: 2, name: 'Salted Pasta with mushroom sauce', price: 2.69, stock: 12, category: 'Cold Dishes', image: '/api/placeholder/80/80', onMenu: true },
    { id: 3, name: 'Beef dumpling in hot and sour soup', price: 2.99, stock: 8, category: 'Soup', image: '/api/placeholder/80/80', onMenu: true },
    { id: 4, name: 'Healthy noodle with spinach leaf', price: 3.29, stock: 18, category: 'Hot Dishes', image: '/api/placeholder/80/80', onMenu: true },
    { id: 5, name: 'Hot spicy fried rice with omelet', price: 3.49, stock: 5, category: 'Hot Dishes', image: '/api/placeholder/80/80', onMenu: true },
    { id: 6, name: 'Spicy instant noodle with special omelette', price: 3.59, stock: 10, category: 'Hot Dishes', image: '/api/placeholder/80/80', onMenu: true },
    { id: 7, name: 'Summer vegetable salad', price: 2.79, stock: 6, category: 'Cold Dishes', image: '/api/placeholder/80/80', onMenu: false },
    { id: 8, name: 'Chocolate lava cake', price: 3.99, stock: 4, category: 'Dessert', image: '/api/placeholder/80/80', onMenu: false }
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'Hot Dishes',
    onMenu: false
  });

  const updateOrderStatus = (id, newStatus) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  const updateInventoryItemStock = (id, amount) => {
    setInventoryItems(inventoryItems.map(item => 
      item.id === id ? { ...item, stock: Math.max(0, item.stock + amount) } : item
    ));
  };

  const toggleMenuStatus = (id) => {
    setInventoryItems(inventoryItems.map(item => 
      item.id === id ? { ...item, onMenu: !item.onMenu } : item
    ));
  };

  const handleNewItemChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItem({
      ...newItem,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const addNewItem = () => {
    if (newItem.name && newItem.price && newItem.stock) {
      const newId = Math.max(...inventoryItems.map(item => item.id)) + 1;
      setInventoryItems([
        ...inventoryItems,
        {
          id: newId,
          name: newItem.name,
          price: parseFloat(newItem.price),
          stock: parseInt(newItem.stock),
          category: newItem.category,
          image: '/api/placeholder/80/80',
          onMenu: newItem.onMenu
        }
      ]);
      setNewItem({
        name: '',
        price: '',
        stock: '',
        category: 'Hot Dishes',
        onMenu: false
      });
    }
  };

  const removeInventoryItem = (id) => {
    setInventoryItems(inventoryItems.filter(item => item.id !== id));
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  // Filter orders based on search query and current tab
  const filteredOrders = orders.filter(order => 
    (order.status === activeTab) && 
    (searchQuery === '' || 
      order.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Filter inventory items based on search query and current tab
  const filteredInventoryItems = inventoryItems.filter(item => 
    (inventoryTab === 'menu' ? item.onMenu : true) &&
    (searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sectionTitle = () => {
    if (activeSection === 'orders') return 'Order Management';
    if (activeSection === 'inventory') {
      return inventoryTab === 'inventory' ? 'Inventory Management' : 'Menu Management';
    }
    return '';
  };

  return (
    <div className="flex h-screen bg-orange-100">
      {/* Sidebar */}
      <div className="w-64 bg-white p-6 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center">
            <img src="/api/placeholder/40/40" alt="Campus Cafe Logo" className="rounded-full mr-2" />
            <h2 className="text-xl font-bold">Campus Cafe</h2>
          </div>
        </div>
        
        <nav className="flex-grow">
          <ul className="space-y-4">
            <li>
              <a href="#" className="flex items-center text-gray-500 hover:text-orange-500">
                <span className="mr-3">🏠</span> Home Page
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`flex items-center ${activeSection === 'orders' ? 'text-orange-500 font-semibold' : 'text-gray-500 hover:text-orange-500'}`}
                onClick={() => setActiveSection('orders')}
              >
                <span className="mr-3">📋</span> Order Management
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className={`flex items-center ${activeSection === 'inventory' ? 'text-orange-500 font-semibold' : 'text-gray-500 hover:text-orange-500'}`}
                onClick={() => setActiveSection('inventory')}
              >
                <span className="mr-3">📦</span> Inventory Management
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-gray-500 hover:text-orange-500">
                <span className="mr-3">📊</span> Reports
              </a>
            </li>
          </ul>
        </nav>
        
        {/* Logout button at the bottom of sidebar */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <button className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center justify-center">
            <span className="mr-2">🚪</span> Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 overflow-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">{sectionTitle()}</h1>
              <p className="text-gray-500">Tuesday, 2 Feb 2021</p>
            </div>
            <div className="flex items-center">
              <div className="relative mr-4">
                <input 
                  type="text" 
                  placeholder={activeSection === 'orders' ? "Search orders, students..." : "Search items, categories..."}
                  className="pl-8 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
              
              {/* User profile with ADMIN tag */}
              <div className="flex items-center">
                <img src={adminUser.avatar} alt="Admin User" className="w-10 h-10 rounded-full mr-2" />
                <div>
                  <p className="font-medium text-sm">{adminUser.name}</p>
                  <p className="text-xs font-bold text-orange-500">(ADMIN)</p>
                </div>
              </div>
            </div>
          </div>

          {activeSection === 'orders' && (
            <>
              {/* Tab Navigation for Orders */}
              <div className="border-b mb-6">
                <ul className="flex">
                  <li className="mr-6">
                    <a 
                      href="#" 
                      className={`pb-2 ${activeTab === 'pending' ? 'text-orange-500 border-b-2 border-orange-500 font-medium' : 'text-gray-500 hover:text-orange-500'}`}
                      onClick={() => setActiveTab('pending')}
                    >
                      Pending Orders
                    </a>
                  </li>
                  <li className="mr-6">
                    <a 
                      href="#" 
                      className={`pb-2 ${activeTab === 'accepted' ? 'text-orange-500 border-b-2 border-orange-500 font-medium' : 'text-gray-500 hover:text-orange-500'}`}
                      onClick={() => setActiveTab('accepted')}
                    >
                      Accepted Orders
                    </a>
                  </li>
                  <li className="mr-6">
                    <a 
                      href="#" 
                      className={`pb-2 ${activeTab === 'rejected' ? 'text-orange-500 border-b-2 border-orange-500 font-medium' : 'text-gray-500 hover:text-orange-500'}`}
                      onClick={() => setActiveTab('rejected')}
                    >
                      Rejected Orders
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className={`pb-2 ${activeTab === 'completed' ? 'text-orange-500 border-b-2 border-orange-500 font-medium' : 'text-gray-500 hover:text-orange-500'}`}
                      onClick={() => setActiveTab('completed')}
                    >
                      Completed Orders
                    </a>
                  </li>
                </ul>
              </div>

              {/* Orders */}
              <div className="grid grid-cols-1 gap-6">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <div key={order.id} className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg">{order.studentName}</h3>
                          <p className="text-gray-500">{order.studentId} • {order.orderTime}</p>
                        </div>
                        {order.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'accepted')}
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'rejected')}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {order.status === 'accepted' && (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                              Mark as Completed
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium mb-2">Order Items:</h4>
                        <ul className="mb-4">
                          {order.items.map((item, index) => (
                            <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                              <div className="flex items-center">
                                <img src="/api/placeholder/40/40" alt={item.name} className="w-10 h-10 rounded-full mr-3" />
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-gray-500">${item.price} × {item.quantity}</p>
                                </div>
                              </div>
                              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            </li>
                          ))}
                        </ul>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                          <p className="font-medium">Total:</p>
                          <p className="font-bold text-lg">${calculateTotal(order.items)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchQuery ? 'No matching orders found.' : `No ${activeTab} orders available.`}
                  </div>
                )}
              </div>
            </>
          )}

          {activeSection === 'inventory' && (
            <>
              {/* Tab Navigation for Inventory */}
              <div className="border-b mb-6">
                <ul className="flex">
                  <li className="mr-6">
                    <a 
                      href="#" 
                      className={`pb-2 ${inventoryTab === 'inventory' ? 'text-orange-500 border-b-2 border-orange-500 font-medium' : 'text-gray-500 hover:text-orange-500'}`}
                      onClick={() => setInventoryTab('inventory')}
                    >
                      Inventory Items
                    </a>
                  </li>
                  <li className="mr-6">
                    <a 
                      href="#" 
                      className={`pb-2 ${inventoryTab === 'menu' ? 'text-orange-500 border-b-2 border-orange-500 font-medium' : 'text-gray-500 hover:text-orange-500'}`}
                      onClick={() => setInventoryTab('menu')}
                    >
                      Menu Management
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className={`pb-2 ${inventoryTab === 'add' ? 'text-orange-500 border-b-2 border-orange-500 font-medium' : 'text-gray-500 hover:text-orange-500'}`}
                      onClick={() => setInventoryTab('add')}
                    >
                      Add New Item
                    </a>
                  </li>
                </ul>
              </div>

              {inventoryTab === 'add' ? (
                <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
                  <h3 className="font-bold text-lg mb-4">Add New Food Item</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Item Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={newItem.name}
                        onChange={handleNewItemChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                        placeholder="Food item name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Category</label>
                      <select 
                        name="category"
                        value={newItem.category}
                        onChange={handleNewItemChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                      >
                        <option value="Hot Dishes">Hot Dishes</option>
                        <option value="Cold Dishes">Cold Dishes</option>
                        <option value="Soup">Soup</option>
                        <option value="Grill">Grill</option>
                        <option value="Dessert">Dessert</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Price ($)</label>
                      <input 
                        type="number" 
                        name="price"
                        value={newItem.price}
                        onChange={handleNewItemChange}
                        step="0.01"
                        min="0"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Initial Stock</label>
                      <input 
                        type="number" 
                        name="stock"
                        value={newItem.stock}
                        onChange={handleNewItemChange}
                        min="0"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        name="onMenu"
                        checked={newItem.onMenu}
                        onChange={handleNewItemChange}
                        className="mr-2"
                      />
                      <span>Add to Menu Immediately</span>
                    </label>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={addNewItem}
                      disabled={!newItem.name || !newItem.price || !newItem.stock}
                      className={`px-4 py-2 rounded ${!newItem.name || !newItem.price || !newItem.stock ? 'bg-gray-300 text-gray-500' : 'bg-orange-400 text-white hover:bg-orange-500'}`}
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Category Filter (can be expanded) */}
                  <div className="mb-6">
                    <ul className="flex flex-wrap">
                      <li className="mr-4 mb-2">
                        <a href="#" className="text-orange-500 font-medium">All Categories</a>
                      </li>
                      <li className="mr-4 mb-2">
                        <a href="#" className="text-gray-500 hover:text-orange-500">Hot Dishes</a>
                      </li>
                      <li className="mr-4 mb-2">
                        <a href="#" className="text-gray-500 hover:text-orange-500">Cold Dishes</a>
                      </li>
                      <li className="mr-4 mb-2">
                        <a href="#" className="text-gray-500 hover:text-orange-500">Soup</a>
                      </li>
                      <li className="mr-4 mb-2">
                        <a href="#" className="text-gray-500 hover:text-orange-500">Grill</a>
                      </li>
                      <li>
                        <a href="#" className="text-gray-500 hover:text-orange-500">Dessert</a>
                      </li>
                    </ul>
                  </div>

                  {/* Inventory Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredInventoryItems.length > 0 ? (
                      filteredInventoryItems.map(item => (
                        <div key={item.id} className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                          <div className="flex justify-center mb-4">
                            <img src={item.image} alt={item.name} className="w-32 h-32 rounded-full" />
                          </div>
                          <h3 className="font-medium text-center mb-1">{item.name}</h3>
                          <p className="text-center text-gray-500 mb-1">${item.price}</p>
                          <p className="text-center text-xs text-gray-500 mb-3">{item.category}</p>
                          
                          {inventoryTab === 'inventory' ? (
                            <div className="flex justify-between items-center mt-4">
                              <div className="flex items-center">
                                <span className="text-gray-500 mr-2">Stock:</span>
                                <span className="font-medium">{item.stock}</span>
                              </div>
                              <div className="flex items-center">
                                <button 
                                  onClick={() => updateInventoryItemStock(item.id, -1)}
                                  className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300"
                                  disabled={item.stock <= 0}
                                >
                                  -
                                </button>
                                <button 
                                  onClick={() => updateInventoryItemStock(item.id, 1)}
                                  className="bg-orange-400 text-white w-8 h-8 rounded-full flex items-center justify-center ml-2 hover:bg-orange-500"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col mt-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-500">Status:</span>
                                <span className={`text-sm font-medium ${item.onMenu ? 'text-green-500' : 'text-red-500'}`}>
                                  {item.onMenu ? 'On Menu' : 'Not on Menu'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <button 
                                  onClick={() => removeInventoryItem(item.id)}
                                  className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
                                >
                                  Delete
                                </button>
                                <button 
                                  onClick={() => toggleMenuStatus(item.id)}
                                  className={`px-3 py-1 text-sm rounded ${item.onMenu ? 'bg-gray-500 hover:bg-gray-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                                >
                                  {item.onMenu ? 'Remove from Menu' : 'Add to Menu'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        {searchQuery ? 'No matching items found.' : 'No items available.'}
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminPage;