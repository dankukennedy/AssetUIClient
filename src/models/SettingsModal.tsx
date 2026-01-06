import React, { useEffect, useState } from 'react';
import { X, AlertCircle, User, Mail, AtSign } from 'lucide-react';
import { Button } from '../component/ui/button';
import { cn } from '../lib/utils';

export interface UserProfile {
  fullName: string;
  username: string;
  email: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserProfile) => void;
  initialData: UserProfile;
  isDark: boolean;
}

export const SettingsModal = ({ isOpen, onClose, onSave, initialData, isDark }: SettingsModalProps) => {
  const [formData, setFormData] = useState<UserProfile>(initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setError(null);
    }
  }, [initialData, isOpen]);

  const validate = () => {
    if (!formData.fullName.trim()) return "Full name is required";
    if (!formData.username.trim()) return "Username is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return "Please enter a valid email address";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={cn(
        "w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200",
        isDark ? "bg-[#111118] border border-white/10 text-white" : "bg-white text-gray-900 border border-gray-100"
      )}>
        {/* Header */}
        <div className={cn("px-6 py-4 border-b flex justify-between items-center", isDark ? "border-white/5" : "border-gray-100")}>
          <div className="flex items-center gap-2">
            <User size={18} className="text-blue-500" />
            <h3 className="font-black uppercase tracking-tight text-sm">Edit Profile</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">Full Name</label>
            <div className="relative">
              <input
                type="text"
                className={cn(
                  "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                  isDark ? "bg-black/20 border-white/10 text-white" : "bg-gray-50 border-gray-200"
                )}
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">Username</label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-xs",
                  isDark ? "bg-black/20 border-white/10 text-white" : "bg-gray-50 border-gray-200"
                )}
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="email"
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-xs",
                  isDark ? "bg-black/20 border-white/10 text-white" : "bg-gray-50 border-gray-200"
                )}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
            <Button variant="ghost" type="button" onClick={onClose} className="text-xs font-black uppercase">
              Cancel
            </Button>
            <Button variant="default" type="submit" className="text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};