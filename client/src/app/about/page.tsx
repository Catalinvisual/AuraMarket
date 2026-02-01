"use client";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 pb-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">We are AuraMarket.</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
            Pioneering the intersection of lifestyle, technology, and sustainable luxury since 2024.
          </p>
        </motion.div>

        {/* Content */}
        <div className="space-y-20">
          <motion.section 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="prose prose-lg dark:prose-invert mx-auto"
          >
            <p>
              In a world saturated with noise, we believe in the power of curation. AuraMarket wasn't founded to just sell products; it was created to filter the signal from the noise. We scour the globe for innovations that don't just look good but actually enhance the way you live, work, and interact with the world around you.
            </p>
          </motion.section>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-gray-100 dark:border-gray-800 py-12">
            {[
              { label: "Products", value: "2.5k+" },
              { label: "Happy Clients", value: "50k+" },
              { label: "Countries", value: "30+" },
              { label: "Years", value: "2" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="text-center py-8">
             <h3 className="text-2xl font-bold mb-4 dark:text-white">Our Mission</h3>
             <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
               To accelerate the world's transition to a seamless, technology-integrated lifestyle where tools disappear and experiences remain.
             </p>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-96 mb-12">
            <div className="h-64 md:h-full rounded-2xl overflow-hidden">
               <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop" className="w-full h-full object-cover" alt="Office" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4 h-48 md:h-full">
               <div className="rounded-2xl overflow-hidden h-full">
                 <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Meeting" />
               </div>
               <div className="rounded-2xl overflow-hidden h-full">
                 <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Team" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
