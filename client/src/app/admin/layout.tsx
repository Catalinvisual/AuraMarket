
"use client";
import AdminSidebar from "@/components/admin/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Home } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Protect Admin Route
  useEffect(() => {
    // If we're not authenticated (and not checking), or if we are authenticated but not admin
    // Note: This is a client-side check. Server-side middleware is better for security, 
    // but this works for the UI.
    if (!isAuthenticated) {
        // router.push("/auth/login"); // Let the individual pages or AuthContext handle redirects to avoid flickers
    } else if (user && user.role !== 'ADMIN') {
        router.push("/dashboard");
    }
  }, [user, isAuthenticated, router]);

  if (!user || user.role !== 'ADMIN') {
      return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen transition-all duration-300">
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white pl-12 lg:pl-0">
                Admin Panel
            </h2>
            <div className="flex items-center gap-4">
                <Link 
                  href="/" 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 hover:text-purple-600 transition-colors"
                  title="Go to Home"
                >
                  <Home size={20} />
                </Link>

                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                        {user.name}
                    </span>
                </div>
            </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
