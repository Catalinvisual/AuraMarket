"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Trash2, CreditCard, MapPin, Truck, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/lib/api";
import Cookies from "js-cookie";
import { API_URL } from "@/lib/api";

export default function CheckoutPage() {
  const { cart, subtotal, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please login to place an order");
      router.push("/login");
      return;
    }

    setLoading(true);
    
    try {
      const token = Cookies.get('token');
      
      const orderData = {
        userId: user.id,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: subtotal,
        address: {
          street: formData.address,
          city: formData.city,
          zip: formData.zip,
          country: formData.country || "Romania", // Defaulting if not in form
          state: "" // Optional in schema?
        }
      };

      await axios.post(`${API_URL}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setLoading(false);
      setStep(3);
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4 dark:text-white">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Add some items to your cart to proceed with checkout.</p>
          <Link 
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            <ArrowLeft size={20} />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {step === 3 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2 dark:text-white">Order Placed Successfully!</h2>
            <p className="text-gray-500 mb-8">Thank you for your purchase. We'll send you an email with your order details.</p>
            <Link 
              href="/dashboard"
              className="block w-full py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Go to Dashboard
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Forms */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 text-gray-400'}`}>1</div>
                  <h2 className="text-xl font-bold dark:text-white">Shipping Information</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postal Code</label>
                    <input 
                      type="text" 
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 text-gray-400'}`}>2</div>
                  <h2 className="text-xl font-bold dark:text-white">Payment Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="text" 
                        name="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        name="expiry"
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVC</label>
                      <input 
                        type="text" 
                        name="cvc"
                        placeholder="123"
                        value={formData.cvc}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Order Summary */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:sticky lg:top-24 h-fit"
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-6 dark:text-white">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative flex-shrink-0">
                        {item.image ? (
                           <Image 
                             src={item.image.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${item.image}`}
                             alt={item.name}
                             fill
                             className="object-cover"
                           />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Truck size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium dark:text-white line-clamp-1">{item.name}</h3>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="font-bold dark:text-white">€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors h-fit"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-700">
                    <span>Total</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>Processing...</>
                  ) : (
                    <>Place Order €{subtotal.toFixed(2)}</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
