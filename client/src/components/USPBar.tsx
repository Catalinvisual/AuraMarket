"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import * as Icons from "lucide-react";

interface USPItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  displayOrder: number;
}

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.HelpCircle className={className} />;
  return <IconComponent className={className} />;
};

export default function USPBar() {
  const [usps, setUsps] = useState<USPItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUSPs = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/usp`);
        setUsps(response.data);
      } catch (error) {
        console.error("Error fetching USPs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUSPs();
  }, []);

  if (loading) return null;
  if (usps.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {usps.map((usp) => (
            <div 
              key={usp.id} 
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-md dark:hover:bg-gray-800 transition-all duration-300 group"
            >
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                <DynamicIcon name={usp.icon} className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  {usp.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {usp.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
