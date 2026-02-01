import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  name: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

interface User {
  name: string;
  email: string;
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  user: User;
  items: OrderItem[];
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Details</h2>
              <p className="text-sm text-gray-500">#{order.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Status & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                  order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                  order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                Customer Information
              </h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{order.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{order.user.email}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                Order Items
              </h3>
              <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Product</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500">Qty</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500">Price</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{item.product.name}</td>
                        <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">€{item.price}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                          €{(item.quantity * Number(item.price)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">Total Amount</td>
                      <td className="px-4 py-3 text-right font-bold text-purple-600">€{Number(order.total).toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
