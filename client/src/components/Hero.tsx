"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: {
    name: string;
  };
}

export default function Hero() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products?isFeatured=true&limit=2`);
        setFeaturedProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching featured products", error);
      }
    };
    fetchFeatured();
  }, []);

  const leftProduct = featuredProducts[0] || {
    name: "Neon Runners",
    price: 189.00,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2370&auto=format&fit=crop"],
    category: { name: "Sport Edition" }
  };

  const rightProduct = featuredProducts[1] || {
    name: "Studio Pro",
    price: 349.00,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2370&auto=format&fit=crop"],
    category: { name: "High-Fidelity" }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-black dark:to-purple-950 transition-colors duration-500">
      {/* Abstract Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-indigo-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto pt-16">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-purple-200 bg-purple-50/50 dark:bg-purple-900/20 dark:border-purple-800 backdrop-blur-sm"
        >
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">New Collection 2026 Released</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight"
        >
          Redefine Your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 animate-gradient-x">Style & Soul</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Welcome to AuraMarket. The ultimate destination for modern lifestyle products. 
          Experience seamless shopping with our AI-powered recommendations.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-4 items-center"
        >
          <Link href="/shop" className="group relative px-8 py-4 bg-black text-white rounded-full font-semibold overflow-hidden shadow-lg hover:shadow-2xl transition-all dark:bg-white dark:text-black">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10 group-hover:text-white dark:group-hover:text-white flex items-center gap-2">
              Start Shopping
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
          </Link>
          <Link href="/about" className="px-8 py-4 bg-white/50 backdrop-blur-sm text-gray-900 rounded-full font-semibold border border-gray-200 hover:bg-gray-50 transition-all dark:bg-gray-900/50 dark:text-white dark:border-gray-700 dark:hover:bg-gray-800">
            View Lookbook
          </Link>
        </motion.div>
      </div>

      {/* Floating Product Cards (Decorative) - Moved outside container for better spacing */}
      <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="hidden xl:block absolute top-1/2 left-8 w-64 p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 rotate-[-12deg] hover:rotate-0 transition-transform duration-500 z-10 -translate-y-1/2 cursor-pointer"
      >
            <Link href={leftProduct.id ? `/shop/${leftProduct.id}` : '/shop'}>
              <div className="h-40 relative rounded-xl overflow-hidden mb-3">
                <img 
                  src={leftProduct.images[0]?.startsWith('http') ? leftProduct.images[0] : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${leftProduct.images[0]}`} 
                  className="w-full h-full object-cover" 
                  alt={leftProduct.name} 
                />
              </div>
              <div className="flex justify-between items-center px-1">
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{leftProduct.name}</p>
                  <p className="text-[10px] text-gray-500">{leftProduct.category?.name || 'Featured'}</p>
                </div>
                <span className="text-xs font-bold text-purple-600">€{Number(leftProduct.price).toFixed(2)}</span>
              </div>
            </Link>
      </motion.div>
      
      <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="hidden xl:block absolute top-1/2 right-8 w-64 p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 rotate-[12deg] hover:rotate-0 transition-transform duration-500 z-10 -translate-y-1/2 cursor-pointer"
      >
            <Link href={rightProduct.id ? `/shop/${rightProduct.id}` : '/shop'}>
              <div className="h-40 relative rounded-xl overflow-hidden mb-3">
                <img 
                  src={rightProduct.images[0]?.startsWith('http') ? rightProduct.images[0] : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${rightProduct.images[0]}`} 
                  className="w-full h-full object-cover" 
                  alt={rightProduct.name} 
                />
              </div>
              <div className="flex justify-between items-center px-1">
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{rightProduct.name}</p>
                  <p className="text-[10px] text-gray-500">{rightProduct.category?.name || 'Featured'}</p>
                </div>
                <span className="text-xs font-bold text-purple-600">€{Number(rightProduct.price).toFixed(2)}</span>
              </div>
            </Link>
      </motion.div>
    </section>
  );
}
