import React, { useState } from 'react';
import { Layout } from '../component/Layout';
import { 
  Settings, Edit2, Lock, User, ShieldCheck, 
  Terminal, Globe, Laptop, History, Clock, 
  CheckCircle2, XCircle, ShieldAlert, Activity 
} from 'lucide-react';
import { useTheme } from '../component/theme-provider';
import { cn } from '../lib/utils';
import { Button } from "../component/ui/button";
import { AccountSettingsModal, type UserProfile } from '../models/AccountSettingsModal';

const AccountSettings = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "John Doe",
    username: "kennedy",
    email: "kennedy.doe@sys-admin.io",
    avatar: "" 
  });

  const logs = [
    { id: 1, action: "Login Attempt Failed", device: "Unknown Device", location: "Pyongyang, KP", time: "Just now", status: "failure", detail: "Invalid credential entry from unrecognized IP" },
    { id: 2, action: "Authentication Success", device: "MacBook Pro 16", location: "Accra, GH", time: "2 mins ago", status: "success", detail: "Session started via biometric auth" },
    { id: 3, action: "Password Change Success", device: "MacBook Pro 16", location: "Accra, GH", time: "5 hours ago", status: "success", detail: "Key rotation completed" },
    { id: 4, action: "Database Access Denied", device: "Chrome / Windows", location: "London, UK", time: "1 day ago", status: "failure", detail: "Unauthorized attempt to access Production_DB" },
  ];

  return (
    <Layout title="Account Settings" icon={Settings}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Card */}
          <div className={cn("p-10 rounded-3xl border shadow-sm transition-all", isDark ? "bg-[#111118] border-white/5 text-white" : "bg-white border-gray-100")}>
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Identity Profile</h3>
              <Button variant="ghost" onClick={() => setIsModalOpen(true)} className="text-blue-500 text-[10px] font-black tracking-widest hover:bg-blue-500/10">
                <Edit2 size={14} className="mr-2" /> EDIT RECORDS
              </Button>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                <div className={cn("w-32 h-32 rounded-3xl flex items-center justify-center text-4xl font-black border-4 shadow-2xl overflow-hidden", isDark ? "bg-black border-white/10 text-blue-500" : "bg-gray-50 border-white text-blue-600")}>
                  {profile.avatar ? <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" /> : profile.fullName.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-xl text-white shadow-lg border-2 border-white/10"><ShieldCheck size={16} /></div>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 w-full">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                  <p className="text-lg font-bold">{profile.fullName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System UID</label>
                  <p className="text-sm font-mono text-blue-500">@{profile.username}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Log Card */}
          <div className={cn("p-10 rounded-3xl border shadow-sm", isDark ? "bg-[#111118] border-white/5 text-white" : "bg-white border-gray-100")}>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Terminal size={18} /></div>
                <h3 className="text-sm font-black uppercase tracking-widest">Security Event Log</h3>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[9px] font-black tracking-tighter uppercase">248 Success</span>
                <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-500 text-[9px] font-black tracking-tighter uppercase">2 Failures</span>
              </div>
            </div>
            <div className="space-y-0 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
              {logs.map((log) => (
                <div key={log.id} className="relative pl-10 pb-8 last:pb-0 group">
                  <div className={cn("absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-transform group-hover:scale-110", isDark ? "bg-[#0d0d12]" : "bg-white", log.status === 'success' ? "border-emerald-500/50 text-emerald-500" : "border-red-500/50 text-red-500")}>
                    {log.status === 'success' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  </div>
                  <div className={cn("p-5 rounded-2xl border transition-all", isDark ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]" : "bg-gray-50/50 border-gray-100 hover:bg-gray-50")}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={cn("text-sm font-black tracking-tight", log.status === 'failure' && "text-red-500")}>{log.action}</p>
                          {log.status === 'failure' && <span className="animate-pulse h-2 w-2 rounded-full bg-red-500"></span>}
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium mt-1 mb-3">{log.detail}</p>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest"><Laptop size={12} /> {log.device}</span>
                          <span className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest"><Globe size={12} /> {log.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col items-center md:items-end gap-2">
                        <span className="text-[10px] font-mono font-bold opacity-40">{log.time}</span>
                        <div className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest", log.status === 'success' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>{log.status}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className={cn("p-8 rounded-3xl border shadow-sm", isDark ? "bg-[#111118] border-white/5 text-white" : "bg-white border-gray-100")}>
            <div className="flex items-center gap-3 mb-6"><Lock size={18} className="text-blue-500" /><h3 className="text-xs font-black uppercase tracking-widest">Security Node</h3></div>
            <p className="text-[11px] text-gray-500 mb-6 font-medium leading-relaxed">Update your security key every 90 days.</p>
            <Button className="w-full py-6 bg-blue-600 cursor-pointer text-white rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-xl shadow-blue-500/20">Change Password</Button>
          </div>
          <div className={cn("p-8 rounded-3xl border border-t-4 border-t-red-500", isDark ? "bg-[#111118] border-white/5 text-white" : "bg-red-50/30 border-red-100")}>
            <div className="flex items-center gap-3 mb-6"><ShieldAlert size={18} className="text-red-500" /><h3 className="text-xs font-black uppercase tracking-widest text-red-500">Danger Zone</h3></div>
            <Button variant="ghost" className="w-full text-red-500 text-[10px] font-black tracking-widest hover:bg-red-500/10">DEACTIVATE NODE</Button>
          </div>
        </div>
      </div>

      <AccountSettingsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={(data) => { setProfile(data); setIsModalOpen(false); }} initialData={profile} isDark={isDark} />
    </Layout>
  );
};

export default AccountSettings;