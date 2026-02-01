"use client";
import { motion } from "framer-motion";
import { Package, User, CreditCard, Settings, LogOut, Search, Plus, Trash2, Edit2, Save, X, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import Cookies from 'js-cookie';

export default function Dashboard() {
  const { user, logout, login } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");
  
  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/28', isDefault: true }
  ]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '' });

  // Settings State
  const [settings, setSettings] = useState({
    emailNotifications: true,
    twoFactor: false
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user?.id) return;
    try {
      const token = Cookies.get('token');
      // Fetch all orders (limit 100 for now to "see all")
      const response = await axios.get(`http://localhost:5000/api/orders?userId=${user.id}&limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Profile Handlers
  const handleUpdateProfile = async () => {
    if (!user?.id) return;
    
    setProfileLoading(true);
    setProfileMessage(null);
    
    try {
      const token = Cookies.get('token');
      // Optimistic update logic if needed, but we'll wait for response
      const response = await axios.put(`http://localhost:5000/api/users/${user.id}`, 
        { ...profileData, role: user.role },
        { headers: { Authorization: `Bearer ${token}` } } // Ensure token is sent if needed by middleware
      );

      // Update local context
      // Note: We need the token to re-login/update context. 
      // Assuming existing token is valid.
      if (token) {
        login(token, { ...user, ...profileData });
      }

      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setProfileLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setProfileMessage(null), 3000);
    }
  };

  // Payment Handlers
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    const newId = Math.max(...paymentMethods.map(p => p.id), 0) + 1;
    const last4 = newCard.number.slice(-4) || '0000';
    
    setPaymentMethods([
      ...paymentMethods, 
      { 
        id: newId, 
        type: 'Mastercard', // Mock type detection
        last4: last4, 
        expiry: newCard.expiry, 
        isDefault: paymentMethods.length === 0 
      }
    ]);
    setIsAddingCard(false);
    setNewCard({ number: '', expiry: '', cvc: '' });
  };

  const handleDeleteCard = (id: number) => {
    setPaymentMethods(paymentMethods.filter(p => p.id !== id));
  };

  // Settings Handlers
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;

    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const token = Cookies.get('token');
        await axios.delete(`http://localhost:5000/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        logout();
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Order History</h2>
            {ordersLoading ? (
               <div className="text-center py-10 text-gray-500">Loading orders...</div>
            ) : orders.length === 0 ? (
               <div className="text-center py-10 text-gray-500">No orders found.</div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsOrderModalOpen(true);
                    }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-purple-200 transition-colors cursor-pointer bg-white dark:bg-gray-800"
                  >
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative flex-shrink-0">
                        {order.items && order.items.length > 0 && order.items[0].product && order.items[0].product.images && order.items[0].product.images.length > 0 ? (
                           <Image 
                             src={order.items[0].product.images[0]} 
                             alt={`Order ${order.id}`}
                             fill
                             className="object-cover"
                           />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <Package size={24} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <p className="font-medium dark:text-white">Order #{order.id.slice(0, 8)}</p>
                           <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                             {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.items?.length || 0} items • <span className={`capitalize ${
                            order.status === 'DELIVERED' ? 'text-green-600' : 
                            order.status === 'SHIPPED' ? 'text-blue-600' : 'text-yellow-600'
                          }`}>{order.status.toLowerCase()}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-purple-600 font-bold text-lg">€{Number(order.total).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Order Details Modal */}
            {isOrderModalOpen && selectedOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <div>
                      <h3 className="text-xl font-bold dark:text-white">Order Details</h3>
                      <p className="text-sm text-gray-500">#{selectedOrder.id}</p>
                    </div>
                    <button 
                      onClick={() => setIsOrderModalOpen(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <p className="text-sm text-gray-500 mb-1">Date Placed</p>
                        <p className="font-medium dark:text-white">
                          {new Date(selectedOrder.createdAt).toLocaleDateString()} at {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <p className="text-sm text-gray-500 mb-1">Status</p>
                        <p className={`font-medium capitalize ${
                            selectedOrder.status === 'DELIVERED' ? 'text-green-600' : 
                            selectedOrder.status === 'SHIPPED' ? 'text-blue-600' : 'text-yellow-600'
                          }`}>
                          {selectedOrder.status.toLowerCase()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4 dark:text-white">Items</h4>
                      <div className="space-y-3">
                        {selectedOrder.items?.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="h-12 w-12 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden relative">
                                {item.product?.images?.[0] ? (
                                  <Image 
                                    src={item.product.images[0]} 
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full text-gray-400">
                                    <Package size={16} />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium dark:text-white line-clamp-1">{item.product?.name || 'Product'}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-medium dark:text-white">€{(Number(item.price) * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between items-center">
                      <span className="font-bold text-lg dark:text-white">Total Amount</span>
                      <span className="font-bold text-2xl text-purple-600">€{Number(selectedOrder.total).toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        );
      case "profile":
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold dark:text-white">My Profile</h2>
              {!isEditingProfile ? (
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  <Edit2 size={16} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                   <button 
                    onClick={() => {
                      setIsEditingProfile(false);
                      setProfileData({ name: user?.name || '', email: user?.email || '' }); // Reset
                    }}
                    className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 font-medium text-sm"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                  <button 
                    onClick={handleUpdateProfile}
                    disabled={profileLoading}
                    className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>{profileLoading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </div>

            {profileMessage && (
              <div className={`mb-6 p-4 rounded-xl text-sm ${
                profileMessage.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {profileMessage.text}
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 text-2xl font-bold">
                  {user?.name?.[0] || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-medium dark:text-white">{user?.name || 'User Name'}</h3>
                  <p className="text-gray-500">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 dark:text-white transition-colors ${
                      isEditingProfile 
                        ? 'border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent' 
                        : 'border-gray-200 dark:border-gray-700 text-gray-500'
                    }`}
                    readOnly={!isEditingProfile}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 dark:text-white transition-colors ${
                      isEditingProfile 
                        ? 'border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent' 
                        : 'border-gray-200 dark:border-gray-700 text-gray-500'
                    }`}
                    readOnly={!isEditingProfile}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case "payment-methods":
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold dark:text-white">Payment Methods</h2>
            </div>
            
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-16 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                      <CreditCard size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">{method.type} ending in {method.last4}</p>
                      <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {method.isDefault && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Default</span>
                    )}
                    <button 
                      onClick={() => handleDeleteCard(method.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove card"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {!isAddingCard ? (
              <button 
                onClick={() => setIsAddingCard(true)}
                className="mt-6 flex items-center space-x-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Plus size={16} />
                <span>Add Payment Method</span>
              </button>
            ) : (
              <form onSubmit={handleAddCard} className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                <h3 className="font-medium mb-4 dark:text-white">New Card Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="0000 0000 0000 0000"
                      value={newCard.number}
                      onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Expiry</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        value={newCard.expiry}
                        onChange={(e) => setNewCard({...newCard, expiry: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                        required
                      />
                    </div>
                     <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">CVC</label>
                      <input 
                        type="text" 
                        placeholder="123"
                        value={newCard.cvc}
                        onChange={(e) => setNewCard({...newCard, cvc: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                  >
                    Save Card
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsAddingCard(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        );
      case "settings":
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-6 dark:text-white">Account Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div>
                  <p className="font-medium dark:text-white">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates about your orders</p>
                </div>
                <button 
                  onClick={() => toggleSetting('emailNotifications')}
                  className={`relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer ${
                    settings.emailNotifications ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`absolute top-0.5 inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                    settings.emailNotifications ? 'left-6.5 translate-x-0.5' : 'left-0.5'
                  }`}></span>
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div>
                  <p className="font-medium dark:text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <button 
                  onClick={() => toggleSetting('twoFactor')}
                  className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
                    settings.twoFactor 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                  }`}
                >
                  {settings.twoFactor ? 'Enabled' : 'Enable'}
                </button>
              </div>

              <div className="mt-8 p-4 border border-red-100 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
                  <h3 className="text-lg font-medium text-red-900 dark:text-red-400">Danger Zone</h3>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button 
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center space-x-2"
                >
                  <Trash2 size={16} />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Account</h1>
            <p className="text-gray-500 dark:text-gray-400">Welcome back, {user?.name || 'User'}</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit"
          >
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "orders" 
                    ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 font-medium" 
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                }`}
              >
                <Package size={20} />
                <span>Orders</span>
              </button>
              <button 
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "profile" 
                    ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 font-medium" 
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                }`}
              >
                <User size={20} />
                <span>Profile</span>
              </button>
              <button 
                onClick={() => setActiveTab("payment-methods")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "payment-methods" 
                    ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 font-medium" 
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                }`}
              >
                <CreditCard size={20} />
                <span>Payment Methods</span>
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === "settings" 
                    ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 font-medium" 
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50"
                }`}
              >
                <Settings size={20} />
                <span>Settings</span>
              </button>
            </nav>
          </motion.div>

          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1 md:col-span-2 space-y-6"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
