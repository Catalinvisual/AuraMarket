"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import * as Icons from "lucide-react";
import { Edit, Save, X } from "lucide-react";

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

export default function USPPage() {
  const [usps, setUsps] = useState<USPItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<USPItem>>({});

  useEffect(() => {
    fetchUSPs();
  }, []);

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

  const handleEdit = (usp: USPItem) => {
    setEditingId(usp.id);
    setEditForm(usp);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/usp/${editingId}`, editForm);
      setEditingId(null);
      fetchUSPs();
    } catch (error) {
      console.error("Error updating USP", error);
      alert("Failed to update USP");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">USP Bar (Benefits Section)</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage the benefits bar displayed under the Hero section.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {usps.map((usp) => (
          <div key={usp.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            
            {/* Icon Preview */}
            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
               {editingId === usp.id ? (
                 <DynamicIcon name={editForm.icon || 'HelpCircle'} className="w-8 h-8" />
               ) : (
                 <DynamicIcon name={usp.icon} className="w-8 h-8" />
               )}
            </div>

            <div className="flex-grow space-y-4 w-full">
              {editingId === usp.id ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle</label>
                    <input
                      type="text"
                      name="subtitle"
                      value={editForm.subtitle || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Icon Name (Lucide React)</label>
                    <input
                      type="text"
                      name="icon"
                      value={editForm.icon || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                    />
                    <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="text-xs text-purple-600 hover:underline mt-1 block">Browse Icons</a>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Display Order</label>
                    <input
                      type="number"
                      name="displayOrder"
                      value={editForm.displayOrder || 0}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{usp.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{usp.subtitle}</p>
                  <div className="text-xs text-gray-400 mt-2 flex gap-4">
                    <span>Icon: {usp.icon}</span>
                    <span>Order: {usp.displayOrder}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-shrink-0">
              {editingId === usp.id ? (
                <div className="flex gap-2">
                  <button onClick={handleSave} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                    <Save size={20} />
                  </button>
                  <button onClick={handleCancel} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <button onClick={() => handleEdit(usp)} className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                  <Edit size={20} />
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
