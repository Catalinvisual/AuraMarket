"use client";
import Hero from "@/components/Hero";
import USPBar from "@/components/USPBar";
import Testimonials from "@/components/Testimonials";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
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
  rating?: number; // Backend doesn't have rating yet, optional
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string, image: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products?limit=8&isFeatured=true`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products/categories`)
        ]);
        
        setFeaturedProducts(productsRes.data.products);
        setCategories(categoriesRes.data.slice(0, 3)); // Take first 3 for the display
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to local data
        const mappedFallbackProducts = fallbackProducts.slice(0, 8).map(p => ({
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
        setFeaturedProducts(mappedFallbackProducts);

        const uniqueCats = Array.from(new Set(fallbackProducts.map(p => p.category)));
        const mappedCategories = uniqueCats.slice(0, 3).map((c, i) => ({
          id: `cat-${i}`,
          name: c,
          image: fallbackProducts.find(p => p.category === c)?.image || '/placeholder.svg'
        }));
        setCategories(mappedCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <USPBar />
      
      {/* Featured Collection Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Best Sellers</h2>
                <p className="text-gray-500 dark:text-gray-400">Discover the latest innovations in lifestyle technology.</p>
              </div>
              <Link href="/shop" className="hidden md:flex items-center gap-2 text-white bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all duration-300">
                View all products <ArrowRight size={20} />
              </Link>
           </div>

           {loading ? (
             <div className="flex justify-center items-center h-64">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4 aspect-square">
                    <img 
                      src={product.images && product.images.length > 0 ? (product.images[0].startsWith('http') ? product.images[0] : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${product.images[0]}`) : '/placeholder.svg'} 
                      alt={product.name} 
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-bold rounded-full">NEW</span>
                    </div>
                    <Link href={`/shop/${product.id}`}>
                      <button className="absolute bottom-4 right-4 bg-white dark:bg-black text-black dark:text-white p-3 rounded-full shadow-lg translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <ArrowRight size={20} />
                      </button>
                    </Link>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 transition-colors">{product.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{product.category?.name || 'Uncategorized'}</p>
                      <p className="text-xs text-gray-400 line-clamp-2 max-w-[180px]">{product.description}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-lg">€{product.price}</span>
                      <div className="flex items-center text-yellow-400 text-xs mt-1">
                        <Star size={12} fill="currentColor" />
                        <span className="ml-1 text-gray-400">{product.rating || 5.0}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
             </div>
           )}

           
           <div className="mt-12 text-center md:hidden">
              <Link href="/shop" className="inline-flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 transition-colors">
                View all products <ArrowRight size={18} />
              </Link>
           </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {categories.length > 0 ? categories.map((cat, i) => (
               <Link href={`/shop?category=${encodeURIComponent(cat.name)}`} key={i} className="relative group overflow-hidden rounded-3xl h-80">
                 <img 
                   src={cat.image || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2371&auto=format&fit=crop'} 
                   alt={cat.name}
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                   onError={(e) => {
                     (e.target as HTMLImageElement).src = '/placeholder.svg';
                   }}
                 />
                 <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                 <div className="absolute bottom-6 left-6 text-white">
                   <h3 className="text-2xl font-bold mb-2">{cat.name}</h3>
                   <span className="flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                     Explore <ArrowRight size={16} />
                   </span>
                 </div>
               </Link>
             )) : (
               /* Fallback skeleton or empty state */
               <div className="col-span-3 text-center text-gray-500">Loading categories...</div>
             )}
          </div>
        </div>
      </section>

      {/* Brands/Logos Section */}
      <section className="py-16 border-y border-gray-800 bg-black">
        <div className="max-w-full mx-auto overflow-hidden">
          <p className="text-center text-sm font-semibold text-gray-400 mb-10 uppercase tracking-widest">Trusted by innovative companies</p>
          <div className="flex relative overflow-hidden">
             <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10"></div>
             <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10"></div>
             
             <motion.div 
               className="flex gap-20 items-center whitespace-nowrap px-10"
               animate={{ x: ["0%", "-50%"] }}
               transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
             >
               {[...['TechNova', 'BioLife', 'Quantum', 'Aura', 'FutureWear', 'CyberSystems', 'NanoTech'], ...['TechNova', 'BioLife', 'Quantum', 'Aura', 'FutureWear', 'CyberSystems', 'NanoTech']].map((brand, i) => (
                 <span key={i} className="text-4xl font-black text-white opacity-80 hover:opacity-100 transition-opacity cursor-default">{brand}</span>
               ))}
             </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">Join the Future</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Subscribe to our newsletter to get early access to new drops and exclusive offers.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <button className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
