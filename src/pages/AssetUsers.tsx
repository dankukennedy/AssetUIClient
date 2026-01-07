import React, { useState, useMemo } from "react";
import { Layout } from "../component/Layout";
import {
  Users as UsersIcon,
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Monitor,
  CheckCircle2,
  SquareArrowOutUpLeft,
  ShieldCheck,
  Download,
  AlertOctagon,
  Loader2,
  Filter,
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";
import { AssetUserModal } from "../models/AssetUsersModal";

// --- Types ---
export interface User {
  name: string;
  role: string;
  status: string;
  email: string;
  avatar?: string;
  location?: string;
  assetName?: string;
  assetId?: string;
  department?: string;
  date?: string;
}

const AssetUsersPage = () => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  // Deletion States
  const [deleteEmail, setDeleteEmail] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Notification States
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", sub: "" });

  const itemsPerPage = 6;

  // Mock Data
  const [users, setUsers] = useState<User[]>([
    {
      name: "Edem Quist",
      role: "Administrator",
      status: "Active",
      email: "edem@sys-admin.io",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Edem",
      assetName: "MacBook Pro M3",
      assetId: "SYS-MBP-992",
      department: "Core Engineering",
      date: "2024-01-15",
    },
    {
      name: "Sarah Smith",
      role: "Lead Designer",
      status: "Active",
      email: "sarah@creative.io",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      assetName: "iPad Pro",
      assetId: "SYS-IPD-441",
      department: "Design",
      date: "2024-02-10",
    },
  ]);

  // --- Logic: Trigger Toast ---
  const triggerToast = (title: string, sub: string) => {
    setToastMessage({ title, sub });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // --- Handlers ---
  const handleSave = (data: User) => {
    const userWithAvatar = {
      ...data,
      avatar:
        data.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
    };

    if (selectedUser) {
      setUsers(
        users.map((u) => (u.email === selectedUser.email ? userWithAvatar : u))
      );
      triggerToast("Identity Updated", "User record synchronized");
    } else {
      setUsers([userWithAvatar, ...users]);
      triggerToast("Subject Registered", "New identity added to registry");
    }
    setIsModalOpen(false);
  };

  const confirmPurge = async () => {
    if (!deleteEmail) return;
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 800)); // Simulate API call

    setUsers(users.filter((u) => u.email !== deleteEmail));
    triggerToast("Record Purged", "Access revoked successfully");

    setDeleteEmail(null);
    setIsDeleting(false);
  };

  // --- Search & Filtering Logic ---
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All Statuses" || u.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, users]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginated = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout title="Identity Registry" icon={UsersIcon}>
      {/* 1. TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[2000] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={cn(
              "flex items-center gap-4 px-8 py-5 rounded-[2rem] shadow-2xl border backdrop-blur-md",
              isDark
                ? "bg-[#111118]/90 border-emerald-500/50 text-emerald-400"
                : "bg-white/90 border-emerald-100 text-emerald-600"
            )}
          >
            <CheckCircle2 size={20} />
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-tight">
                {toastMessage.title}
              </span>
              <span className="text-[10px] opacity-70 uppercase font-bold tracking-[0.2em]">
                {toastMessage.sub}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. PURGE CONFIRMATION MODAL */}
      {deleteEmail && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className={cn(
              "p-8 rounded-[2.5rem] border max-w-sm w-full text-center shadow-2xl",
              isDark
                ? "bg-[#0d0d12] border-white/10"
                : "bg-white border-gray-200"
            )}
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertOctagon className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-black mb-2 tracking-tighter uppercase text-red-500">
              Purge Identity?
            </h3>
            <p className="text-[10px] text-gray-500 mb-8 font-mono tracking-widest uppercase">
              Target: {deleteEmail}
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                onClick={() => setDeleteEmail(null)}
              >
                Abort
              </Button>
              <Button
                className="flex-1 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
                onClick={confirmPurge}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2
            className={cn(
              "text-2xl font-black tracking-tight uppercase",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            Identity Index
          </h2>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest italic">
            Corporate Lifecycle Management
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-12 rounded-xl font-black text-[10px] uppercase tracking-widest"
          >
            <Download size={16} className="mr-2" /> Export CSV
          </Button>
          <Button
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="h-12 rounded-xl bg-blue-600 font-black text-[10px] uppercase tracking-widest"
          >
            <Plus size={16} className="mr-2" /> Register Subject
          </Button>
        </div>
      </div>

      {/* 4. SEARCH & FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            className={cn(
              "w-full h-12 pl-12 pr-4 rounded-xl border text-sm font-medium focus:outline-none transition-all",
              isDark
                ? "bg-[#111118] border-white/5 text-white"
                : "bg-white border-gray-100"
            )}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["All Statuses", "Active", "Inactive"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-4 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                statusFilter === status
                  ? "bg-blue-600 border-blue-600 text-white"
                  : isDark
                  ? "bg-white/5 border-white/5 text-gray-400"
                  : "bg-white border-gray-100 text-gray-500"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 5. TABLE CONTENT */}
      <div
        className={cn(
          "rounded-[2rem] border overflow-hidden",
          isDark
            ? "border-white/5 bg-[#111118]"
            : "bg-white shadow-sm border-gray-100"
        )}
      >
        <table className="w-full text-left">
          <thead>
            <tr
              className={cn(
                "text-[10px] uppercase tracking-[0.2em] font-black",
                isDark ? "bg-white/5 text-gray-500" : "bg-gray-50 text-gray-400"
              )}
            >
              <th className="px-8 py-5">Subject Profile</th>
              <th className="px-8 py-5">Role</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody
            className={cn(
              "divide-y",
              isDark ? "divide-white/5" : "divide-gray-50"
            )}
          >
            {paginated.map((user) => (
              <tr
                key={user.email}
                className={cn(
                  "text-sm transition-colors",
                  isDark ? "hover:bg-white/[0.02]" : "hover:bg-blue-50/30"
                )}
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={user.avatar}
                      className="w-10 h-10 rounded-full border-2 border-white/10"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "font-black uppercase tracking-tight",
                          isDark ? "text-gray-200" : "text-gray-900"
                        )}
                      >
                        {user.name}
                      </span>
                      <span className="text-[10px] text-blue-500 font-mono font-black lowercase">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {user.role}
                </td>
                <td className="px-8 py-5">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase",
                      user.status === "Active"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-amber-500/10 text-amber-500"
                    )}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewingUser(user)}
                    >
                      <SquareArrowOutUpLeft size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-red-500"
                      onClick={() => setDeleteEmail(user.email)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 6. MODALS & DRAWERS */}
      {viewingUser && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setViewingUser(null)}
          />
          <aside
            className={cn(
              "relative w-full max-w-lg h-full p-12 shadow-2xl animate-in slide-in-from-right duration-300 border-l",
              isDark
                ? "bg-[#0d0d12] border-white/10 text-white"
                : "bg-white border-gray-200"
            )}
          >
            <button
              onClick={() => setViewingUser(null)}
              className="absolute top-8 right-8 text-slate-500"
            >
              <X size={24} />
            </button>
            <header className="mb-12 pt-6">
              <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden mb-6 border-4 border-blue-500/20 shadow-2xl shadow-blue-500/10">
                <img
                  src={viewingUser.avatar}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
              <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase">
                {viewingUser.name}
              </h2>
              <p className="font-mono text-blue-500 text-sm font-black uppercase opacity-80">
                {viewingUser.email}
              </p>
            </header>
            <section className="space-y-8">
              <div
                className={cn(
                  "rounded-3xl p-8 border shadow-inner",
                  isDark
                    ? "bg-white/5 border-white/5"
                    : "bg-gray-50 border-gray-100"
                )}
              >
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                  <Monitor size={16} /> Allocated Hardware
                </h3>
                <div className="grid grid-cols-2 gap-y-8 text-sm">
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] mb-2">
                      Device
                    </p>
                    <p className="font-black text-lg">
                      {viewingUser.assetName || "UNASSIGNED"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] mb-2">
                      Serial
                    </p>
                    <p className="font-mono text-blue-500 font-black">
                      {viewingUser.assetId || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-blue-600 font-black text-[10px] uppercase h-14 rounded-2xl">
                <ShieldCheck size={18} className="mr-3" /> Audit Compliance Log
              </Button>
            </section>
          </aside>
        </div>
      )}

      {isModalOpen && (
        <AssetUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          initialData={selectedUser}
          isDark={isDark}
        />
      )}
    </Layout>
  );
};

export default AssetUsersPage;
