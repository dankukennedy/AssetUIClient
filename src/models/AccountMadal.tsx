import React, { useEffect, useState } from 'react';
import { X, Camera, User, Mail, AtSign, Globe } from 'lucide-react';
import { Button } from '../component/ui/button';
import { cn } from '../lib/utils';

export interface UserAccount {
  fullName: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserAccount) => void;
  initialData: UserAccount;
  isDark: boolean;
}

export const AccountModal = ({ isOpen, onClose, onSave, initialData, isDark }: AccountModalProps) => {
  const [formData, setFormData] = useState<UserAccount>(initialData);

  useEffect(() => {
    if (isOpen) setFormData(initialData);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className={cn(
        "w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300",
        isDark ? "bg-[#0d0d12] border border-white/10 text-white" : "bg-white text-gray-900"
      )}>
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black uppercase tracking-[0.3em] text-xs opacity-60">Identity Management</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors"><X size={24} /></button>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className={cn(
                  "w-28 h-28 rounded-full flex items-center justify-center overflow-hidden border-4",
                  isDark ? "bg-white/5 border-white/10" : "bg-gray-100 border-white shadow-xl"
                )}>
                  {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="opacity-20" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white cursor-pointer hover:scale-110 transition-transform shadow-lg">
                  <Camera size={18} />
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setFormData({...formData, avatarUrl: URL.createObjectURL(file)});
                    }} 
                  />
                </label>
              </div>
              <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-blue-500">Change Photo</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">Full Name</label>
                <input 
                  className={cn("w-full px-5 py-3 rounded-2xl outline-none border transition-all", isDark ? "bg-white/5 border-white/5 focus:border-blue-500" : "bg-gray-50 border-gray-100")} 
                  value={formData.fullName} 
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">Alias</label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={14} />
                  <input 
                    className={cn("w-full pl-10 pr-4 py-3 rounded-2xl outline-none border font-mono text-sm", isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100")} 
                    value={formData.username} 
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase mb-1 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={14} />
                  <input 
                    className={cn("w-full pl-10 pr-4 py-3 rounded-2xl outline-none border text-sm", isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100")} 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-10">
              <Button variant="ghost" type="button" onClick={onClose} className="font-black uppercase text-[10px]">Cancel</Button>
              <Button type="submit" className="font-black uppercase text-[10px] tracking-widest px-8 shadow-xl shadow-blue-500/20">Save Profile</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};