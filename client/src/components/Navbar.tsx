"use client";
import Link from "next/link";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isSearchOpen ? 'bg-transparent' : 'bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-black/80 dark:border-gray-800'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 z-50">
            AuraMarket
          </Link>

          {/* Desktop Links - Hidden if Search is Open */}
          {!isSearchOpen && (
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-purple-600 dark:text-gray-200 transition-colors font-medium">Home</Link>
              <Link href="/shop" className="text-gray-700 hover:text-purple-600 dark:text-gray-200 transition-colors font-medium">Shop</Link>
              <Link href="/collections" className="text-gray-700 hover:text-purple-600 dark:text-gray-200 transition-colors font-medium">Collections</Link>
              <Link href="/about" className="text-gray-700 hover:text-purple-600 dark:text-gray-200 transition-colors font-medium">About</Link>
            </div>
          )}

          {/* Search Bar Overlay */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed inset-0 z-[100] bg-white dark:bg-black flex flex-col items-center pt-24 px-4 md:px-0"
              >
                <button 
                  type="button" 
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-500 hover:text-purple-600 transition-colors" />
                </button>

                <div className="w-full max-w-2xl">
                  <form onSubmit={handleSearchSubmit} className="relative w-full group">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for products..."
                      className="w-full bg-gray-100 dark:bg-gray-900 border-2 border-transparent focus:border-purple-500 rounded-xl py-3 pl-12 pr-6 text-lg font-bold text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all shadow-lg"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors pointer-events-none z-20" size={20} />
                  </form>
                  
                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Popular Searches</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['Wireless Headphones', 'Smart Watch', 'Running Shoes', 'Laptop'].map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setSearchQuery(term);
                            router.push(`/shop?search=${encodeURIComponent(term)}`);
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/30 dark:hover:text-purple-300 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center space-x-4 z-50">
            {!isSearchOpen && (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-purple-600 dark:text-gray-300 transition-colors"
              >
                <Search size={20} />
              </button>
            )}
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-gray-600 hover:text-purple-600 dark:text-gray-300 relative transition-colors"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-[10px] text-white flex items-center justify-center font-bold shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
             <Link href={user ? "/dashboard" : "/auth/login"} className="p-2 text-gray-600 hover:text-purple-600 dark:text-gray-300 transition-colors">
              <User size={20} />
            </Link>
            <button className="md:hidden p-2 text-gray-600 dark:text-gray-300" onClick={() => setIsOpen(!isOpen)}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
               <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900">Home</Link>
               <Link href="/shop" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900">Shop</Link>
               <Link href="/collections" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900">Collections</Link>
               <Link href="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900">About</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
