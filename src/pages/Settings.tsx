import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Lock, Edit2, ShieldAlert, 
  User, CheckCircle2, AlertCircle, KeyRound, Eye, EyeOff, Trash2
} from 'lucide-react';
import { Layout } from '../component/Layout';
import { useTheme } from '../component/theme-provider';
import { cn } from '../lib/utils';
import { Button } from "../component/ui/button";
import { SettingsModal, type UserProfile } from '../models/SettingsModel';

export default function Settings() {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // --- States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', next: '', confirm: '' });
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com"
  });

  // --- Handlers ---
  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.next !== passwordData.confirm) {
      triggerToast("Passwords do not match", "error");
      return;
    }
    if (passwordData.next.length < 8) {
      triggerToast("Password too short (min 8 chars)", "error");
      return;
    }
    triggerToast("Password updated successfully");
    setPasswordData({ current: '', next: '', confirm: '' });
  };

  const handleDangerZone = (action: 'deactivate' | 'delete') => {
    const confirmMsg = action === 'delete' 
      ? "PERMANENT DELETE: Are you absolutely sure? This cannot be undone." 
      : "Deactivate account? You will be logged out immediately.";
    
    if (window.confirm(confirmMsg)) {
      triggerToast(`${action.toUpperCase()} request sent`, "error");
    }
  };

  return (
    <Layout title="Account Settings" icon={SettingsIcon}>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 right-10 z-[200] animate-in slide-in-from-right-10 fade-in duration-300">
          <div className={cn(
            "flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border",
            toast.type === 'success' 
              ? (isDark ? "bg-[#111118] border-emerald-500/50 text-emerald-400" : "bg-white border-emerald-100 text-emerald-600")
              : (isDark ? "bg-[#111118] border-red-500/50 text-red-400" : "bg-white border-red-100 text-red-600")
          )}>
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-xs font-black uppercase tracking-widest">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile & Security */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Profile Section */}
          <div className={cn("p-10 rounded-3xl border shadow-sm transition-all", isDark ? "bg-[#111118] border-white/5 text-white" : "bg-white border-gray-100")}>
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black tracking-tight uppercase tracking-widest text-sm opacity-80">Profile Information</h3>
              <Button variant="ghost" className="text-blue-500 text-[10px] font-black tracking-widest hover:bg-blue-500/10" onClick={() => setIsModalOpen(true)}>
                <Edit2 size={14} className="mr-2"/> EDIT
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-dashed border-white/10">
                <div className={cn("w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black shadow-2xl", isDark ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : "bg-gray-50 text-blue-600 border border-white")}>
                  {userProfile.fullName.charAt(0)}
                </div>
                <span className="mt-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Identity</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Display Name</label>
                  <p className="font-bold text-lg">{userProfile.fullName}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">System Alias</label>
                  <p className="font-mono text-blue-500">@{userProfile.username}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Form */}
          <div className={cn("p-10 rounded-3xl border shadow-sm", isDark ? "bg-[#111118] border-white/5 text-white" : "bg-white border-gray-100")}>
            <div className="flex items-center gap-3 mb-8">
              <KeyRound size={20} className="text-blue-500" />
              <h3 className="text-sm font-black uppercase tracking-widest">Credentials</h3>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 relative">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Current Password</label>
                  <input 
                    type={showPassword ? "text" : "password"}
                    className={cn("w-full px-4 py-3 rounded-xl border outline-none text-sm font-mono", isDark ? "bg-black/20 border-white/10" : "bg-gray-50 border-gray-200")}
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-10 text-gray-500">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">New Password</label>
                  <input 
                    type="password"
                    className={cn("w-full px-4 py-3 rounded-xl border outline-none text-sm font-mono", isDark ? "bg-black/20 border-white/10" : "bg-gray-50 border-gray-200")}
                    value={passwordData.next}
                    onChange={(e) => setPasswordData({...passwordData, next: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Confirm Access Key</label>
                  <input 
                    type="password"
                    className={cn("w-full px-4 py-3 rounded-xl border outline-none text-sm font-mono", isDark ? "bg-black/20 border-white/10" : "bg-gray-50 border-gray-200")}
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full py-6 mt-4 font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20">
                Update Security Key
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column: Danger Zone */}
        <div className="space-y-8">
          <div className={cn(
            "p-8 rounded-3xl border shadow-2xl border-t-4",
            isDark ? "bg-[#111118] border-white/5 border-t-red-600" : "bg-red-50/20 border-red-100 border-t-red-500"
          )}>
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert size={22} className="text-red-600" />
              <h3 className="text-sm font-black uppercase tracking-widest text-red-600">Danger Zone</h3>
            </div>
            
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tight mb-8 leading-relaxed">
              Caution: Actions in this section are permanent and may impact system accessibility.
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 mb-6">
                <p className="text-[10px] font-black uppercase text-red-500 mb-2">Account Status</p>
                <button 
                  onClick={() => handleDangerZone('deactivate')}
                  className="w-full py-3 bg-white/5 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                >
                  Deactivate Node
                </button>
              </div>

              <button 
                onClick={() => handleDangerZone('delete')}
                className="w-full py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all"
              >
                <Trash2 size={14} /> Purge Account
              </button>
            </div>
          </div>

          <div className={cn("p-6 rounded-2xl border border-dashed text-center", isDark ? "border-white/10" : "border-gray-200")}>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Session ID</p>
            <p className="font-mono text-[10px] text-blue-500 opacity-50">#SX-992-PX-2026</p>
          </div>
        </div>
      </div>

      <SettingsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newData) => { setUserProfile(newData); setIsModalOpen(false); triggerToast("Identity Updated"); }}
        initialData={userProfile}
        isDark={isDark}
      />
    </Layout>
  );
}