import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 pt-16 pb-8 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              AuraMarket
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Redefining the digital shopping experience with cutting-edge design and AI-driven recommendations. The future of e-commerce is here.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Shop</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/shop" className="hover:text-purple-600 transition-colors">All Products</Link></li>
              <li><Link href="/collections/new" className="hover:text-purple-600 transition-colors">New Arrivals</Link></li>
              <li><Link href="/collections/featured" className="hover:text-purple-600 transition-colors">Featured</Link></li>
              <li><Link href="/collections/sale" className="hover:text-purple-600 transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Support</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/faq" className="hover:text-purple-600 transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-purple-600 transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/privacy" className="hover:text-purple-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-purple-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-purple-600" />
                <span>123 Innovation Dr, Tech City, TC 90210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-purple-600" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-purple-600" />
                <span>support@auramarket.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="text-sm text-gray-400">
              © 2026 AuraMarket. All rights reserved.
            </p>
            <span className="hidden md:block text-gray-300">|</span>
            <p className="text-sm text-gray-400">
              Created by <a href="https://www.haplogic.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors font-medium">HapLogic</a>
            </p>
          </div>
          <div className="flex items-center space-x-6">
             <span className="text-xs text-gray-400 uppercase tracking-wider">Secure Payment</span>
             <div className="flex space-x-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" alt="Visa" className="h-6 w-auto" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" className="h-6 w-auto" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 w-auto" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="American Express" className="h-6 w-auto" />
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
