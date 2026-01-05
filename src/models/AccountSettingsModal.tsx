import React, { useEffect, useState } from 'react';
import { X, Camera, User, Mail, AtSign } from 'lucide-react';
import { Button } from '../component/ui/button';
import { cn } from '../lib/utils';

export interface UserProfile {
  fullName: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserProfile) => void;
  initialData: UserProfile;
  isDark: boolean;
}

export const AccountSettingsModal = ({ isOpen, onClose, onSave, initialData, isDark }: AccountModalProps) => {
  const [formData, setFormData] = useState<UserProfile>(initialData);

  useEffect(() => {
    if (isOpen) setFormData(initialData);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={cn(
        "w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200",
        isDark ? "bg-[#0d0d12] border border-white/10 text-white" : "bg-white text-gray-900 border border-gray-100"
      )}>
        <div className={cn("px-8 py-5 border-b flex justify-between items-center", isDark ? "border-white/5" : "border-gray-100")}>
          <h3 className="font-black uppercase tracking-widest text-xs">Edit Global Profile</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors"><X size={20} /></button>
        </div>

        <form className="p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-blue-500/20 overflow-hidden bg-gray-100">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-black text-blue-500">
                    {formData.fullName.charAt(0)}
                  </div>
                )}
              </div>
              <button type="button" className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-lg group-hover:scale-110 transition-transform">
                <Camera size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">Full Name</label>
              <input 
                className={cn("w-full px-4 py-2 rounded-xl border outline-none text-sm font-bold", isDark ? "bg-black/20 border-white/10" : "bg-gray-50 border-gray-200")}
                value={formData.fullName} 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">Username</label>
              <input 
                className={cn("w-full px-4 py-2 rounded-xl border outline-none text-sm font-mono text-blue-500", isDark ? "bg-black/20 border-white/10" : "bg-gray-50 border-gray-200")}
                value={formData.username} 
                onChange={(e) => setFormData({...formData, username: e.target.value})} 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
            <Button variant="ghost" type="button" onClick={onClose} className="text-[10px] font-black uppercase">Cancel</Button>
            <Button variant="default" type="submit" className="text-[10px] font-black uppercase tracking-widest">Update Profile</Button>
          </div>
        </form>
      </div>
    </div>
  );
};