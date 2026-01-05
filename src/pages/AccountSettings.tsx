import React, { useState, useMemo } from 'react';
import { Layout } from '../component/Layout';
import { 
  Settings, Edit2, Lock, ShieldCheck, Terminal, Globe, 
  Laptop, CheckCircle2, XCircle, ShieldAlert, 
  Search, Filter, ChevronDown, ListFilter 
} from 'lucide-react';
import { useTheme } from '../component/theme-provider';
import { cn } from '../lib/utils';
import { Button } from "../component/ui/button";
import { AccountSettingsModal, type UserProfile } from '../models/AccountSettingsModal';

const AccountSettings = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failure'>('all');
  const [displayLimit, setDisplayLimit] = useState(6);

  const [profile, setProfile] = useState<UserProfile>({
    fullName: "John Doe",
    username: "kennedy",
    email: "kennedy.doe@sys-admin.io",
    avatar: "" 
  });

  // Expanded Log Data
  const logs = [
    { id: 1, action: "Login Attempt Failed", device: "Unknown Device", location: "Pyongyang, KP", time: "Just now", status: "failure", detail: "Invalid credential entry from unrecognized IP" },
    { id: 2, action: "Authentication Success", device: "MacBook Pro 16", location: "Accra, GH", time: "2 mins ago", status: "success", detail: "Session started via biometric auth" },
    { id: 3, action: "Password Change Success", device: "MacBook Pro 16", location: "Accra, GH", time: "5 hours ago", status: "success", detail: "Key rotation completed" },
    { id: 4, action: "Database Access Denied", device: "Chrome / Windows", location: "London, UK", time: "1 day ago", status: "failure", detail: "Unauthorized attempt to access Production_DB" },
    { id: 5, action: "Database Access Denied", device: "Chrome / Windows", location: "London, UK", time: "1 day ago", status: "failure", detail: "Unauthorized attempt to access Production_DB" },
    { id: 6, action: "Firewall Policy Update", device: "System Terminal", location: "Localhost", time: "2 days ago", status: "success", detail: "Port 8080 opened for ingress traffic" },
    { id: 7, action: "Database Access Denied", device: "Chrome / Windows", location: "London, UK", time: "2 days ago", status: "failure", detail: "Unauthorized attempt to access Production_DB" },
    { id: 8, action: "New SSH Key Pair", device: "MacBook Pro 16", location: "Accra, GH", time: "3 days ago", status: "success", detail: "Admin key 'id_ed25519' authorized" },
    { id: 9, action: "Database Access Denied", device: "Chrome / Windows", location: "London, UK", time: "4 days ago", status: "failure", detail: "Unauthorized attempt to access Production_DB" },
  ];

  // Logic: Filter and Paginate Logs
  const filteredLogs = useMemo(() => {
    return logs
      .filter(log => {
        const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              log.detail.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .slice(0, displayLimit);
  }, [searchQuery, statusFilter, displayLimit]);

  return (
    <Layout title="Account Settings" icon={Settings}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Card */}
          <div className={cn("p-10 rounded-[2.5rem] border shadow-sm transition-all", isDark ? "bg-[#111118] border-white/5 text-white" : "bg-white border-gray-100")}>
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Identity Profile</h3>
              <Button variant="ghost" onClick={() => setIsModalOpen(true)} className="text-blue-500 text-[10px] font-black tracking-widest hover:bg-blue-500/10">
                <Edit2 size={14} className="mr-2" /> EDIT RECORDS
              </Button>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                <div className={cn("w-32 h-32 rounded-[2rem] flex items-center justify-center text-4xl font-black border-4 shadow-2xl overflow-hidden", isDark ? "bg-black border-white/10 text-blue-500" : "bg-gray-50 border-white text-blue-600")}>
                  {profile.avatar ? <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" /> : profile.fullName.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-xl text-white shadow-lg border-2 border-white/10"><ShieldCheck size={16} /></div>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 w-full text-center md:text-left">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Global Name</label>
                  <p className="text-xl font-black">{profile.fullName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Network UID</label>
                  <p className="text-sm font-mono text-blue-500 font-bold">@{profile.username}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Managed Audit Log Card */}
          <div className={cn("rounded-[2.5rem] border shadow-sm overflow-hidden", isDark ? "bg-[#111118] border-white/5 text-white" : "bg-white border-gray-100")}>
            <div className="p-8 border-b border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><Terminal size={18} /></div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Security Audit Log</h3>
                </div>
                <div className="hidden md:flex gap-2">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/5 text-emerald-500 text-[9px] font-black uppercase tracking-tighter border border-emerald-500/10">Active Protection</span>
                </div>
              </div>

              {/* Management Controls */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className={cn("flex-1 flex items-center px-4 py-2 rounded-2xl border", isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200")}>
                  <Search size={14} className="text-gray-500 mr-3" />
                  <input 
                    className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest w-full" 
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setStatusFilter('all')}
                    className={cn("px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all", 
                      statusFilter === 'all' ? "bg-blue-600 text-white border-blue-600" : (isDark ? "bg-white/5 border-white/10 text-gray-500" : "bg-white border-gray-200"))}
                  >All</button>
                  <button 
                    onClick={() => setStatusFilter('failure')}
                    className={cn("px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all", 
                      statusFilter === 'failure' ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20" : (isDark ? "bg-white/5 border-white/10 text-gray-500" : "bg-white border-gray-200"))}
                  >Failures</button>
                </div>
              </div>
            </div>

            {/* Scrollable Log Body */}
            <div className="relative">
              <div className="max-h-[500px] overflow-y-auto p-8 pt-6 scrollbar-hide">
                <div className="space-y-0 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="relative pl-10 pb-8 last:pb-4 group">
                      <div className={cn("absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-all group-hover:scale-110", isDark ? "bg-[#111118]" : "bg-white", log.status === 'success' ? "border-emerald-500/30 text-emerald-500" : "border-red-500/30 text-red-500")}>
                        {log.status === 'success' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                      </div>
                      <div className={cn("p-5 rounded-3xl border transition-all", isDark ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]" : "bg-gray-50/50 border-gray-100 hover:bg-gray-50")}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={cn("text-xs font-black tracking-tight", log.status === 'failure' && "text-red-500 uppercase")}>{log.action}</p>
                              {log.status === 'failure' && <span className="animate-pulse h-1.5 w-1.5 rounded-full bg-red-500"></span>}
                            </div>
                            <p className="text-[10px] text-gray-500 font-medium mt-1 leading-relaxed">{log.detail}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <span className="flex items-center gap-1.5 text-[8px] font-black text-gray-500 uppercase tracking-[0.1em]"><Laptop size={10} /> {log.device}</span>
                              <span className="flex items-center gap-1.5 text-[8px] font-black text-gray-500 uppercase tracking-[0.1em]"><Globe size={10} /> {log.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-mono font-bold opacity-30 block mb-1">{log.time}</span>
                            <div className={cn("px-2 py-0.5 rounded-md inline-block text-[8px] font-black uppercase tracking-widest", log.status === 'success' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>{log.status}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Bottom Fade Gradient (Management for "Plenty" logs) */}
              <div className={cn("absolute bottom-0 left-0 right-0 h-16 pointer-events-none", isDark ? "bg-gradient-to-t from-[#111118] to-transparent" : "bg-gradient-to-t from-white to-transparent")}></div>
            </div>

            <div className="p-6 text-center border-t border-white/5">
              <button 
                onClick={() => setDisplayLimit(prev => prev + 5)}
                className="text-[10px] font-black text-blue-500 flex items-center gap-2 mx-auto uppercase tracking-[0.3em] hover:opacity-70 transition-opacity"
              >
                <ChevronDown size={14} /> Fetch More History
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className={cn("p-8 rounded-[2.5rem] border shadow-sm", isDark ? "bg-[#111118] border-white/5 text-white" : "bg-white border-gray-100")}>
            <div className="flex items-center gap-3 mb-6"><Lock size={18} className="text-blue-500" /><h3 className="text-[10px] font-black uppercase tracking-widest">Security Node</h3></div>
            <p className="text-[10px] text-gray-500 mb-8 font-medium leading-relaxed uppercase tracking-tight">Key rotation is recommended every 90 days to maintain compliance.</p>
            <Button className="w-full py-6 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-xl shadow-blue-500/20">Rotate Access Key</Button>
          </div>
          <div className={cn("p-8 rounded-[2.5rem] border border-t-4 border-t-red-500/50", isDark ? "bg-[#111118] border-white/5 text-white" : "bg-red-50/20 border-red-100")}>
            <div className="flex items-center gap-3 mb-6"><ShieldAlert size={18} className="text-red-500" /><h3 className="text-[10px] font-black uppercase tracking-widest text-red-500">Termination</h3></div>
            <Button variant="ghost" className="w-full text-red-500 text-[10px] font-black tracking-widest hover:bg-red-500/10 border border-red-500/10 py-5">DEACTIVATE ACCOUNT</Button>
          </div>
        </div>
      </div>

      <AccountSettingsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={(data) => { setProfile(data); setIsModalOpen(false); }} initialData={profile} isDark={isDark} />
    </Layout>
  );
};

export default AccountSettings;