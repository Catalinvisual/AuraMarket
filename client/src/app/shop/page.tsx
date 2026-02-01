"use client";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, Star, ArrowRight, ChevronDown } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

import { useCart } from "@/context/CartContext";
import { products as fallbackProducts } from "@/lib/data";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: {
    name: string;
  };
  images: string[];
  rating?: number;
}

export default function Shop() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products?limit=100`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products/categories`)
        ]);
        
        setProducts(productsRes.data.products);
        
        const fetchedCategories = categoriesRes.data.map((c: any) => c.name);
        setCategories(["All", ...fetchedCategories]);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to local data if API fails
        const mappedFallbackProducts = fallbackProducts.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          category: {
            name: p.category
          },
          images: [p.image],
          rating: p.rating
        }));
        setProducts(mappedFallbackProducts);
        
        const uniqueCategories = Array.from(new Set(fallbackProducts.map(p => p.category)));
        setCategories(["All", ...uniqueCategories]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory("All");
    }
    
    if (search) {
      setSearchQuery(search);
    } else {
      setSearchQuery("");
    }
  }, [searchParams]);

  const updateUrl = (category: string, search: string) => {
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("category", category);
    if (search) params.set("search", search);
    
    const queryString = params.toString();
    router.push(queryString ? `/shop?${queryString}` : "/shop");
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateUrl(category, searchQuery);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleSearchBlur = () => {
    updateUrl(selectedCategory, searchQuery);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      updateUrl(selectedCategory, searchQuery);
    }
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    router.push("/shop");
  };

  const filteredProducts = products.filter(product => {
    const categoryName = product.category?.name || 'Uncategorized';
    const matchesCategory = selectedCategory === "All" || categoryName === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Shop All</h1>
            <p className="text-gray-500 dark:text-gray-400">Explore our collection of futuristic gear.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
             <div className="relative w-full sm:w-auto flex items-center">
               <input 
                 type="text" 
                 placeholder="Search products..." 
                 value={searchQuery}
                 onChange={handleSearchChange}
                 onBlur={handleSearchBlur}
                 onKeyDown={handleSearchKeyDown}
                 className="pl-12 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64 transition-all"
               />
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={20} />
             </div>
             
             {/* Desktop Categories */}
             <div className="hidden sm:flex flex-wrap items-center gap-2">
               {categories.map(category => (
                 <button
                   key={category}
                   onClick={() => handleCategoryChange(category)}
                   className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                     selectedCategory === category 
                       ? "bg-black text-white dark:bg-white dark:text-black shadow-lg scale-105" 
                       : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700"
                   }`}
                 >
                   {category}
                 </button>
               ))}
             </div>

             {/* Mobile Category Dropdown */}
             <div className="w-full sm:hidden relative z-30">
               <button 
                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                 className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-left font-medium text-gray-900 dark:text-white"
               >
                 <span>{selectedCategory}</span>
                 <ChevronDown size={20} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
               </button>
               
               <AnimatePresence>
                 {isDropdownOpen && (
                   <motion.div
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     transition={{ duration: 0.2 }}
                     className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden py-1"
                   >
                     {categories.map(category => (
                       <button
                         key={category}
                         onClick={() => {
                           handleCategoryChange(category);
                           setIsDropdownOpen(false);
                         }}
                         className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                           selectedCategory === category
                             ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium"
                             : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                         }`}
                       >
                         {category}
                       </button>
                     ))}
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
           <div className="text-center py-20">
             <p className="text-xl text-gray-500">No products found matching your criteria.</p>
             <button 
               onClick={clearFilters}
               className="mt-4 text-purple-600 font-medium hover:underline"
             >
               Clear filters
             </button>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <Link href={`/shop/${product.id}`} className="block relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900 aspect-square mb-4">
                  <img 
                    src={product.images && product.images.length > 0 ? (product.images[0].startsWith('http') ? product.images[0] : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${product.images[0]}`) : '/placeholder.svg'} 
                    alt={product.name} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  {/* New badge logic could go here if we had a field for it */}
                  <div className="absolute bottom-2 right-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="bg-white dark:bg-black p-2 rounded-full shadow-lg">
                      <ArrowRight size={16} className="text-black dark:text-white" />
                    </div>
                  </div>
                </Link>
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">{product.category?.name || 'Uncategorized'}</p>
                    <div className="flex items-center text-yellow-400 text-xs">
                      <Star size={10} fill="currentColor" />
                      <span className="ml-1 text-gray-400">{product.rating || 5.0}</span>
                    </div>
                  </div>
                  <Link href={`/shop/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 h-[40px]">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-900 dark:text-white">€{product.price}</span>
                    <button 
                      onClick={() => {
                         // Adapt product for CartContext which expects legacy structure
                         const cartProduct = {
                           ...product,
                           image: product.images && product.images.length > 0 ? (product.images[0].startsWith('http') ? product.images[0] : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${product.images[0]}`) : '',
                           category: product.category?.name || 'Uncategorized',
                           rating: product.rating || 5.0
                         };
                         // @ts-ignore
                         addToCart(cartProduct);
                      }}
                      className="text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
