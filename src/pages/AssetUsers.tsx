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
  CheckCircle2,
  SquareArrowOutUpLeft,
  ShieldCheck,
  Download,
  AlertOctagon,
  Loader2,
  Filter,
  Briefcase,
  Edit3,
  User2,
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

  // Edit Tracking States
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUserEmail, setEditingUserEmail] = useState<string | null>(null);

  const [viewingUser, setViewingUser] = useState<User | null>(null);

  // Custom Purge States
  const [deleteEmail, setDeleteEmail] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", sub: "" });

  const itemsPerPage = 6;

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

  // Derived unique statuses for filter
  const statusOptions = useMemo(() => {
    const statuses = new Set(users.map((u) => u.status));
    return ["All Statuses", ...Array.from(statuses)];
  }, [users]);

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

    if (editingUserEmail) {
      // Logic Fix: Map through users and find the one that matches the ORIGINAL email
      setUsers((prev) =>
        prev.map((u) => (u.email === editingUserEmail ? userWithAvatar : u))
      );
      triggerToast("Identity Updated", "User record synchronized");
    } else {
      setUsers([userWithAvatar, ...users]);
      triggerToast("Subject Registered", "New identity added to registry");
    }

    setIsModalOpen(false);
    setEditingUserEmail(null);
    setSelectedUser(null);
  };

  const confirmPurge = async () => {
    if (!deleteEmail) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setUsers(users.filter((u) => u.email !== deleteEmail));
    triggerToast("Record Purged", "Access revoked successfully");

    setDeleteEmail(null);
    setIsDeleting(false);
    if (viewingUser?.email === deleteEmail) setViewingUser(null);
  };

  const downloadCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Role",
      "Department",
      "Status",
      "Asset ID",
    ];
    const csvContent = [
      headers.join(","),
      ...users.map((u) =>
        [
          `"${u.name}"`,
          u.email,
          u.role,
          u.department,
          u.status,
          u.assetId || "N/A",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `identity_registry_${new Date().getTime()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Export Successful", "Identity database saved to CSV");
  };

  // --- Logic: Search & Pagination ---
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.department?.toLowerCase() || "").includes(searchTerm.toLowerCase());

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
      {/* 1. PURGE CONFIRMATION MODAL */}
      {deleteEmail && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className={cn(
              "p-8 rounded-[2.5rem] border max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95",
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
                disabled={isDeleting}
                onClick={() => setDeleteEmail(null)}
              >
                Abort
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
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

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[2000] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={cn(
              "flex items-center gap-4 px-8 py-5 rounded-[2rem] shadow-2xl border",
              isDark
                ? "bg-[#111118] border-emerald-500/50 text-emerald-400"
                : "bg-white border-emerald-100 text-emerald-600"
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

      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
        <div>
          <h2
            className={cn(
              "text-2xl font-black tracking-tight uppercase",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            Identity Index
          </h2>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            Managing corporate personnel and access permissions
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="flex-1 sm:flex-none h-12 rounded-xl border-slate-700/50 hover:bg-slate-500/10 font-black text-[10px] uppercase tracking-widest"
          >
            <Download size={16} className="mr-2" /> Export CSV
          </Button>
          <Button
            onClick={() => {
              setEditingUserEmail(null);
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-none h-12 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20"
          >
            <Plus size={16} className="mr-2" /> Register User
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div
        className={cn(
          "p-4 rounded-2xl mb-6 border shadow-sm flex flex-col lg:flex-row gap-4 items-center",
          isDark ? "bg-[#111118] border-white/5" : "bg-white border-gray-100"
        )}
      >
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            placeholder="Search by name, email, or department..."
            className={cn(
              "w-full pl-12 pr-4 py-3 rounded-xl text-sm outline-none transition-all",
              isDark
                ? "bg-black/20 border-white/10 text-white focus:border-blue-500/50"
                : "bg-gray-50 border-gray-200"
            )}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="relative w-full lg:w-64">
          <Filter
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={cn(
              "w-full pl-10 pr-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer",
              isDark
                ? "bg-black/20 border-white/10 text-white focus:border-blue-500/50"
                : "bg-gray-50 border-gray-200 text-gray-700"
            )}
          >
            {statusOptions.map((opt) => (
              <option
                key={opt}
                value={opt}
                className={isDark ? "bg-[#0d0d12]" : "bg-white"}
              >
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={cn(
          "rounded-[2rem] border overflow-hidden",
          isDark
            ? "border-white/5 bg-[#111118]"
            : "bg-white shadow-sm border-gray-100"
        )}
      >
        {/* DESKTOP VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr
                className={cn(
                  "text-[10px] uppercase tracking-[0.2em] font-black",
                  isDark
                    ? "bg-white/5 text-gray-500"
                    : "bg-gray-50 text-gray-400"
                )}
              >
                <th className="px-8 py-5">Identity Profile</th>
                <th className="px-8 py-5">Organizational Unit</th>
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
              {paginated.length > 0 ? (
                paginated.map((user) => (
                  <tr
                    key={user.email}
                    className={cn(
                      "text-sm transition-colors group",
                      isDark ? "hover:bg-white/[0.02]" : "hover:bg-blue-50/30"
                    )}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={user.avatar}
                          className="w-10 h-10 rounded-full border border-white/10"
                          alt=""
                        />
                        <div className="flex flex-col">
                          <span
                            className={cn(
                              "font-black",
                              isDark ? "text-gray-200" : "text-gray-900"
                            )}
                          >
                            {user.name}
                          </span>
                          <span className="text-[10px] text-blue-500 font-mono font-black uppercase tracking-tighter">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "font-black",
                            isDark ? "text-gray-200" : "text-gray-900"
                          )}
                        >
                          {user.role}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                          {user.department}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                          user.status === "Active"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
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
                          className="h-9 w-9 text-gray-400 hover:text-blue-500"
                          onClick={() => setViewingUser(user)}
                        >
                          <SquareArrowOutUpLeft
                            size={14}
                            className="h-8 w-8 text-teal-500"
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-blue-500"
                          onClick={() => {
                            setEditingUserEmail(user.email);
                            setSelectedUser(user);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit3
                            size={14}
                            className="h-8 w-8 text-yellow-500"
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-red-500"
                          onClick={() => setDeleteEmail(user.email)}
                        >
                          <Trash2 size={14} className="h-8 w-8 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                      No matching identities found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW */}
        <div className="md:hidden divide-y divide-white/5">
          {paginated.map((user) => (
            <div key={user.email} className="p-6 flex flex-col gap-5">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <img
                    src={user.avatar}
                    className="w-12 h-12 rounded-2xl"
                    alt=""
                  />
                  <div>
                    <h4
                      className={cn(
                        "font-black text-lg",
                        isDark ? "text-white" : "text-gray-900"
                      )}
                    >
                      {user.name}
                    </h4>
                    <p className="text-[10px] text-blue-500 font-mono font-black uppercase">
                      {user.email}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                    user.status === "Active"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  )}
                >
                  {user.status}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-11 bg-teal-300 border-white/10 text-[9px] uppercase font-black"
                  onClick={() => setViewingUser(user)}
                >
                  Profile Details <User2 className="ml-2 text-teal-900" />
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-11 bg-yellow-100 border-white/10 text-[9px] uppercase font-black"
                  onClick={() => {
                    setEditingUserEmail(user.email);
                    setSelectedUser(user);
                    setIsModalOpen(true);
                  }}
                >
                  Update <Edit3 className="ml-2 text-amber-900" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 text-red-500/50"
                  onClick={() => setDeleteEmail(user.email)}
                >
                  <Trash2 size={16} className="h-8 w-8 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div
          className={cn(
            "px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t",
            isDark
              ? "border-white/5 bg-white/5"
              : "border-gray-100 bg-gray-50/30"
          )}
        >
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest italic">
            TOTAL IDENTITIES: {filteredUsers.length}
          </span>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={14} />
            </Button>
            <span className="text-[11px] font-black font-mono">
              {currentPage} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Side Drawer */}
      {viewingUser && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in"
            onClick={() => setViewingUser(null)}
          />
          <aside
            className={cn(
              "relative w-full max-w-lg h-full p-8 md:p-12 shadow-2xl animate-in slide-in-from-right duration-300 border-l overflow-y-auto",
              isDark
                ? "bg-[#0d0d12] border-white/10 text-white"
                : "bg-white border-gray-200 text-gray-900"
            )}
          >
            <button
              onClick={() => setViewingUser(null)}
              className="absolute top-8 right-8 text-slate-500 hover:text-red-500"
            >
              <X size={24} />
            </button>
            <header className="mb-12 pt-6 text-center md:text-left">
              <img
                src={viewingUser.avatar}
                className="w-24 h-24 rounded-[2rem] border-2 border-blue-500/20 mb-6 mx-auto md:mx-0"
                alt=""
              />
              <h2 className="text-3xl font-black mb-2 tracking-tighter uppercase">
                {viewingUser.name}
              </h2>
              <p className="font-mono text-blue-500 text-sm font-black uppercase tracking-widest">
                {viewingUser.role}
              </p>
            </header>
            <section className="space-y-8">
              <div
                className={cn(
                  "rounded-3xl p-6 md:p-8 border shadow-inner",
                  isDark
                    ? "bg-white/5 border-white/5"
                    : "bg-gray-50 border-gray-100"
                )}
              >
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                  <Briefcase size={16} /> Assignment Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 text-sm">
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] mb-2">
                      Primary Asset
                    </p>
                    <p className="font-black text-lg">
                      {viewingUser.assetName || "Unassigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] mb-2">
                      Asset Serial
                    </p>
                    <p className="font-mono font-black text-blue-500 uppercase">
                      {viewingUser.assetId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] mb-2">
                      Dept.
                    </p>
                    <p className="font-black tracking-tight">
                      {viewingUser.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] mb-2">
                      Onboarded
                    </p>
                    <p className="font-mono font-black">
                      {viewingUser.date || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-white/5 space-y-4">
                <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700 font-black text-[10px] uppercase tracking-[0.2em] h-14 rounded-2xl">
                  <ShieldCheck size={18} className="mr-3" /> System Access Log
                </Button>
              </div>
            </section>
          </aside>
        </div>
      )}

      <AssetUserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUserEmail(null);
          setSelectedUser(null);
        }}
        onSave={handleSave}
        initialData={selectedUser}
        isDark={isDark}
      />
    </Layout>
  );
};

export default AssetUsersPage;
