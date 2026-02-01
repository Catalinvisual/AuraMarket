"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote, User, PlayCircle } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/lib/api";

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  rating: number;
  avatar?: string;
  videoUrl?: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/testimonials`);
        setTestimonials(response.data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) return null;
  if (testimonials.length === 0) return null;

  // Duplicate testimonials to ensure seamless scrolling
  // We need enough copies to fill the screen and allow for the offset
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="max-w-full mx-auto">
        <div className="text-center mb-16 px-4">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Trusted by Customers
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            See what our community has to say about their experience.
          </p>
        </div>

        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex gap-8 px-4"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ 
              repeat: Infinity, 
              duration: 50, // Slow speed
              ease: "linear" 
            }}
            style={{ width: "fit-content" }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="w-[400px] flex-shrink-0 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative group hover:shadow-md transition-shadow"
              >
                <div className="absolute top-8 right-8 text-gray-200 dark:text-gray-700">
                  <Quote size={40} className="transform rotate-180" />
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < testimonial.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10 leading-relaxed line-clamp-4 min-h-[100px]">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar.startsWith('http') ? testimonial.avatar : `${API_URL}${testimonial.avatar}`}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="text-gray-400" size={24} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    {testimonial.role && (
                      <p className="text-sm text-purple-600 dark:text-purple-400">{testimonial.role}</p>
                    )}
                  </div>
                </div>

                {testimonial.videoUrl && (
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <a 
                      href={testimonial.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors"
                    >
                      <PlayCircle size={18} />
                      Watch Video Review
                    </a>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
