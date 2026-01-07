import React, { useState, useMemo, useRef } from "react";
import { Layout } from "../component/Layout";
import {
  Settings,
  Edit2,
  Lock,
  ShieldCheck,
  Terminal,
  Globe,
  Laptop,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Search,
  ChevronDown,
  Trash2,
  UserX,
  Camera,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";
import { useToast } from "../context/ToastContext";
import {
  AccountSettingsModal,
  type UserProfile,
} from "../models/AccountSettingsModal";

const AccountSettings = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // --- States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "success" | "failure"
  >("all");
  const [displayLimit, setDisplayLimit] = useState(6);

  const [profile, setProfile] = useState<UserProfile>({
    fullName: "John Doe",
    username: "kennedy",
    email: "kennedy.doe@sys-admin.io",
    avatar: "",
  });

  const [logs, setLogs] = useState([
    {
      id: 1,
      action: "Login Attempt Failed",
      device: "Unknown Device",
      location: "Pyongyang, KP",
      time: "Just now",
      status: "failure",
      detail: "Invalid credential entry from unrecognized IP",
    },
    {
      id: 2,
      action: "Authentication Success",
      device: "MacBook Pro 16",
      location: "Accra, GH",
      time: "2 mins ago",
      status: "success",
      detail: "Session started via biometric auth",
    },
    {
      id: 3,
      action: "Password Change Success",
      device: "MacBook Pro 16",
      location: "Accra, GH",
      time: "5 hours ago",
      status: "success",
      detail: "Key rotation completed",
    },
  ]);

  // --- Handlers ---
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast(
          "Access Denied",
          "System only accepts valid image protocols (PNG/JPG)",
          "error"
        );
        return;
      }

      setIsUploading(true);
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfile((prev) => ({ ...prev, avatar: base64String }));
        setIsUploading(false);
        toast(
          "Identity Synced",
          "Biometric avatar updated across all nodes",
          "success"
        );
      };

      // Simulated network handshake delay
      setTimeout(() => reader.readAsDataURL(file), 600);
    }
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setIsModalOpen(false);
    toast(
      "Records Updated",
      "Central database successfully synchronized",
      "success"
    );
  };

  const handleDeleteLog = (id: number) => {
    if (window.confirm("Remove this entry from local audit history?")) {
      setLogs(logs.filter((log) => log.id !== id));
      toast("Log Purged", "Single audit entry removed from cache", "warning");
    }
  };

  const handleRotateKey = () => {
    toast("Key Rotated", "New RSA-4096 pair generated and deployed", "success");
  };

  const handleDeactivate = () => {
    if (
      window.confirm(
        "DANGER: This will immediately revoke all access keys. Continue?"
      )
    ) {
      toast(
        "Protocol Terminal",
        "Global access tokens have been invalidated",
        "error"
      );
    }
  };

  // --- Search & Filter Logic ---
  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        const matchesSearch =
          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.detail.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || log.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .slice(0, displayLimit);
  }, [searchQuery, statusFilter, displayLimit, logs]);

  return (
    <Layout title="Account Settings" icon={Settings}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section: Identity and Logs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Card */}
          <div
            className={cn(
              "p-10 rounded-[2.5rem] border shadow-sm transition-all relative overflow-hidden",
              isDark
                ? "bg-[#111118] border-white/5 text-white"
                : "bg-white border-gray-100"
            )}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

            <div className="flex justify-between items-center mb-10 relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                Security Identity
              </h3>
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(true)}
                className="text-blue-500 text-[10px] font-black tracking-widest hover:bg-blue-500/10"
              >
                <Edit2 size={14} className="mr-2" /> EDIT RECORDS
              </Button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              {/* Avatar Upload Container */}
              <div className="relative group">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div
                  onClick={handleAvatarClick}
                  className={cn(
                    "w-36 h-36 rounded-[2.5rem] flex items-center justify-center text-4xl font-black border-4 shadow-2xl overflow-hidden cursor-pointer transition-all duration-500 group-hover:scale-105 group-hover:border-blue-500/50",
                    isDark
                      ? "bg-black border-white/10 text-blue-500"
                      : "bg-gray-50 border-white text-blue-600"
                  )}
                >
                  {isUploading ? (
                    <RefreshCw
                      className="animate-spin text-blue-500"
                      size={32}
                    />
                  ) : profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="leading-none">
                        {profile.fullName.charAt(0)}
                      </span>
                      <span className="text-[10px] uppercase tracking-tighter opacity-40 mt-1 font-mono">
                        ID-01
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm">
                    <Camera className="text-white mb-1" size={24} />
                    <span className="text-[8px] text-white font-black uppercase tracking-tighter">
                      Sync Image
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 p-2.5 bg-blue-600 rounded-2xl text-white shadow-lg border-4 border-[#111118]">
                  <ShieldCheck size={18} />
                </div>
              </div>

              {/* Identity Info */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 w-full text-center md:text-left">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                    Global Name
                  </label>
                  <p className="text-2xl font-black tracking-tight">
                    {profile.fullName}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                    Network UID
                  </label>
                  <p className="text-sm font-mono text-blue-500 font-bold bg-blue-500/5 px-3 py-1 rounded-lg inline-block">
                    @{profile.username}
                  </p>
                </div>
                <div className="md:col-span-2 space-y-1 pt-4 border-t border-white/5">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                    Secure Email
                  </label>
                  <p className="text-sm font-medium opacity-70">
                    {profile.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Log Card */}
          <div
            className={cn(
              "rounded-[2.5rem] border shadow-sm overflow-hidden",
              isDark
                ? "bg-[#111118] border-white/5 text-white"
                : "bg-white border-gray-100"
            )}
          >
            <div className="p-8 border-b border-white/5 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <Terminal size={18} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Security Audit Log
                </h3>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <div
                  className={cn(
                    "flex-1 flex items-center px-4 py-2 rounded-2xl border",
                    isDark
                      ? "bg-white/5 border-white/10"
                      : "bg-gray-50 border-gray-200"
                  )}
                >
                  <Search size={14} className="text-gray-500 mr-3" />
                  <input
                    className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest w-full"
                    placeholder="Filter protocols..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  {(["all", "failure"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setStatusFilter(f)}
                      className={cn(
                        "px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all",
                        statusFilter === f
                          ? f === "all"
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                            : "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20"
                          : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="max-h-[450px] overflow-y-auto p-8 scrollbar-hide">
              <div className="space-y-4 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-white/5">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={cn(
                      "p-5 rounded-3xl border transition-all group flex items-start gap-4",
                      isDark
                        ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                        : "bg-gray-50/50 border-gray-100 hover:bg-white"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-1 w-2 h-2 rounded-full ring-4",
                        log.status === "success"
                          ? "bg-emerald-500 ring-emerald-500/10"
                          : "bg-red-500 ring-red-500/10"
                      )}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p
                          className={cn(
                            "text-xs font-black tracking-tight",
                            log.status === "failure" && "text-red-500"
                          )}
                        >
                          {log.action}
                        </p>
                        <span className="text-[9px] font-mono opacity-30">
                          {log.time}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                        {log.detail}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="flex items-center gap-1.5 text-[8px] font-black text-gray-500 uppercase tracking-widest">
                          <Laptop size={10} /> {log.device}
                        </span>
                        <span className="flex items-center gap-1.5 text-[8px] font-black text-gray-500 uppercase tracking-widest">
                          <Globe size={10} /> {log.location}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500/50 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 text-center border-t border-white/5 bg-white/[0.01]">
              <button
                onClick={() => setDisplayLimit((p) => p + 5)}
                className="text-[10px] font-black text-blue-500 flex items-center gap-2 mx-auto uppercase tracking-[0.3em] hover:opacity-60 transition-opacity"
              >
                <ChevronDown size={14} /> Fetch More History
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <div
            className={cn(
              "p-8 rounded-[2.5rem] border shadow-sm",
              isDark
                ? "bg-[#111118] border-white/5 text-white"
                : "bg-white border-gray-100"
            )}
          >
            <div className="flex items-center gap-3 mb-6">
              <Lock size={18} className="text-blue-500" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">
                Security Node
              </h3>
            </div>
            <p className="text-[10px] text-gray-500 mb-8 font-medium leading-relaxed uppercase tracking-tight">
              Key rotation is recommended every 90 days to maintain maximum
              encryption standards.
            </p>
            <Button
              onClick={handleRotateKey}
              className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-xl shadow-blue-500/20"
            >
              Rotate Access Key
            </Button>
          </div>

          <div
            className={cn(
              "p-8 rounded-[2.5rem] border border-t-4 border-t-red-500/50",
              isDark
                ? "bg-[#111118] border-white/5 text-white"
                : "bg-red-50/20 border-red-100"
            )}
          >
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert size={18} className="text-red-500" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-red-500">
                Danger Zone
              </h3>
            </div>
            <Button
              variant="ghost"
              onClick={handleDeactivate}
              className="w-full text-red-500 text-[10px] font-black tracking-widest hover:bg-red-500/10 border border-red-500/10 py-5"
            >
              <UserX size={14} className="mr-2" /> DEACTIVATE ACCOUNT
            </Button>
          </div>
        </div>
      </div>

      <AccountSettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleUpdateProfile}
        initialData={profile}
        isDark={isDark}
      />
    </Layout>
  );
};

export default AccountSettings;
