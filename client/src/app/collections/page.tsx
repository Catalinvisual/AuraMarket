"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    id: "summer-2026",
    title: "Summer 2026",
    description: "Breathable fabrics and holographic accents for the heat.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
    link: "/shop?category=Apparel"
  },
  {
    id: "urban-tech",
    title: "Urban Techwear",
    description: "Functional utility meets cyberpunk aesthetics.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop",
    link: "/shop?category=Footwear"
  },
  {
    id: "minimalist-home",
    title: "Minimalist Home",
    description: "Smart devices that blend seamlessly into your decor.",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop",
    link: "/shop?category=Home"
  },
  {
    id: "accessories",
    title: "Smart Accessories",
    description: "Wearables that extend your digital self.",
    image: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=1887&auto=format&fit=crop",
    link: "/shop?category=Accessories"
  }
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Curated Collections</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our thoughtfully assembled selections defining the aesthetic of tomorrow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer"
            >
              <img 
                src={collection.image} 
                alt={collection.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-3xl font-bold text-white mb-2">{collection.title}</h3>
                <p className="text-gray-300 mb-6 max-w-md">{collection.description}</p>
                <Link 
                  href={collection.link}
                  className="inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all"
                >
                  View Collection <ArrowRight size={20} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
