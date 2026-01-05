import React, { useState } from 'react';
import { Layout } from '../component/Layout';
import { Settings, Edit2, Lock, User, ShieldCheck, Mail, Camera } from 'lucide-react';
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
    avatar: "" // Add image URL here to test
  });

  return (
    <Layout title="Account Settings" icon={Settings}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          {/* Main Profile Card */}
          <div className={cn(
            "p-10 rounded-3xl border shadow-sm transition-all",
            isDark ? "bg-[#111118] border-white/5 text-white" : "bg-white border-gray-100"
          )}>
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Identity Profile</h3>
              <Button 
                variant="ghost" 
                onClick={() => setIsModalOpen(true)}
                className="text-blue-500 text-[10px] font-black tracking-widest hover:bg-blue-500/10"
              >
                <Edit2 size={14} className="mr-2" /> EDIT RECORDS
              </Button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* Avatar Section */}
              <div className="relative">
                <div className={cn(
                  "w-32 h-32 rounded-3xl flex items-center justify-center text-4xl font-black border-4 shadow-2xl overflow-hidden",
                  isDark ? "bg-black border-white/10 text-blue-500" : "bg-gray-50 border-white text-blue-600"
                )}>
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    profile.fullName.charAt(0)
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-xl text-white shadow-lg border-2 border-white/10">
                  <ShieldCheck size={16} />
                </div>
              </div>

              {/* Info Display */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 w-full">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                  <p className="text-lg font-bold">{profile.fullName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System UID</label>
                  <p className="text-sm font-mono text-blue-500">@{profile.username}</p>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                  <p className="text-sm font-medium opacity-80">{profile.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Sidebar */}
        <div className="space-y-8">
          <div className={cn(
            "p-8 rounded-3xl border shadow-sm",
            isDark ? "bg-[#111118] border-white/5 text-white" : "bg-white border-gray-100"
          )}>
            <div className="flex items-center gap-3 mb-6">
              <Lock size={18} className="text-blue-500" />
              <h3 className="text-xs font-black uppercase tracking-widest">Security Node</h3>
            </div>
            <p className="text-[11px] text-gray-500 mb-6 font-medium leading-relaxed">
              Maintain your access credentials. We recommend updating your security key every 90 days.
            </p>
            <Button className="w-full py-6 bg-blue-600 cursor-pointer text-white rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-xl shadow-blue-500/20">
              Change Password
            </Button>
          </div>
        </div>
      </div>

      <AccountSettingsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => { setProfile(data); setIsModalOpen(false); }}
        initialData={profile}
        isDark={isDark}
      />
    </Layout>
  );
};

export default AccountSettings;