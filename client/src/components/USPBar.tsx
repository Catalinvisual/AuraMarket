"use client";
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
  const usps: USPItem[] = [
    {
      id: "1",
      icon: "Truck",
      title: "Fast Delivery",
      subtitle: "24-48h",
      displayOrder: 1
    },
    {
      id: "2",
      icon: "RefreshCw",
      title: "Free Returns",
      subtitle: "30 days",
      displayOrder: 2
    },
    {
      id: "3",
      icon: "ShieldCheck",
      title: "Secure Payments",
      subtitle: "100% Protected",
      displayOrder: 3
    },
    {
      id: "4",
      icon: "Headphones",
      title: "Customer Support",
      subtitle: "24/7",
      displayOrder: 4
    }
  ];

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
