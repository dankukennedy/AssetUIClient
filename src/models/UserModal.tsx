import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../component/ui/button';
import { cn } from '../lib/utils';

interface User {
  name: string;
  role: string;
  status: string;
  email: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  initialData?: User | null;
  isDark: boolean;
}

export const UserModal = ({ isOpen, onClose, onSave, initialData, isDark }: UserModalProps) => {
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    role: 'User',
    status: 'Active'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', email: '', role: 'User', status: 'Active' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={cn(
        "w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transition-all transform",
        isDark ? "bg-[#111118] border border-white/10" : "bg-white"
      )}>
        {/* Header */}
        <div className={cn("px-6 py-4 border-b flex justify-between items-center", isDark ? "border-white/5" : "border-gray-100")}>
          <h3 className="font-bold text-lg">{initialData ? 'Edit User' : 'Create New User'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Name</label>
            <input 
              required
              className={cn(
                "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                isDark ? "bg-black/20 border-white/10 text-white" : "bg-gray-50 border-gray-200"
              )}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address</label>
            <input 
              required
              type="email"
              className={cn(
                "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                isDark ? "bg-black/20 border-white/10 text-white" : "bg-gray-50 border-gray-200"
              )}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Role</label>
              <select 
                className={cn(
                  "w-full px-4 py-2 rounded-lg border outline-none",
                  isDark ? "bg-black/20 border-white/10 text-white" : "bg-gray-50 border-gray-200"
                )}
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="Administrator">Administrator</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Status</label>
              <select 
                className={cn(
                  "w-full px-4 py-2 rounded-lg border outline-none",
                  isDark ? "bg-black/20 border-white/10 text-white" : "bg-gray-50 border-gray-200"
                )}
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="default" type="submit">
              {initialData ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};