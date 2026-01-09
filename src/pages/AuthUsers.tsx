import React, { useState, useMemo } from "react";
import { Layout } from "../component/Layout";
import {
  Users as UsersIcon,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Download,
  AlertOctagon,
  CheckCircle2,
  ShieldCheck,
  Fingerprint,
  Mail,
  MapPin,
  SquareArrowOutUpLeft,
  Loader2,
  Filter,
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";
import { UserModal } from "../models/AuthUserModal";

// --- Types ---
export interface User {
  name: string;
  role: string;
  status: string;
  email: string;
  avatar?: string;
  location?: string;
}

// --- Sub-Component: Identity Drawer ---
const UserDrawer = ({
  user,
  isOpen,
  onClose,
  isDark,
}: {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}) => {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex justify-end">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in"
        onClick={onClose}
      />
      <aside
        className={cn(
          "relative w-full max-w-lg h-full p-12 shadow-2xl animate-in slide-in-from-right duration-300 border-l overflow-y-auto",
          isDark
            ? "bg-[#0d0d12] border-white/10 text-white"
            : "bg-white border-gray-200 text-gray-900"
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-500 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>

        <header className="mb-12 pt-6">
          <span className="px-4 py-1.5 rounded-full text-[9px] font-black border border-blue-500/50 text-blue-500 mb-6 inline-block uppercase tracking-[0.2em]">
            Identity Profile
          </span>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                <Fingerprint size={32} className="text-blue-500" />
              )}
            </div>
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase">
                {user.name}
              </h2>
              <p className="font-mono text-blue-500 text-sm font-black tracking-tight">
                {user.email}
              </p>
            </div>
          </div>
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
              <ShieldCheck size={16} /> Security Clearance
            </h3>
            <div className="grid grid-cols-2 gap-y-10 text-sm">
              <div>
                <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                  Access Role
                </p>
                <p className="font-black text-lg">{user.role}</p>
              </div>
              <div>
                <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                  Network Status
                </p>
                <p className="font-black text-lg uppercase text-emerald-500">
                  {user.status}
                </p>
              </div>
              <div>
                <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                  Primary Node
                </p>
                <p className="font-black tracking-tight flex items-center gap-2">
                  <MapPin size={14} /> {user.location || "REMOTE"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                  Comms Protocol
                </p>
                <p className="font-mono font-black italic">SECURE-MAIL</p>
              </div>
            </div>
          </div>
          <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700 font-black text-[10px] uppercase tracking-[0.2em] h-14 rounded-2xl shadow-xl shadow-blue-900/20 text-white">
            View Activity Logs
          </Button>
        </section>
      </aside>
    </div>
  );
};

// --- Main Page ---
const AuthUsersPage = () => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [users, setUsers] = useState<User[]>([
    {
      name: "Edem",
      role: "Administrator",
      status: "Active",
      email: "edem@sys-admin.io",
      location: "Accra, GH",
    },
    {
      name: "Sarah Smith",
      role: "Manager",
      status: "Active",
      email: "sarah@sys-admin.io",
      location: "London, UK",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerUser, setDrawerUser] = useState<User | null>(null);
  const [deleteEmail, setDeleteEmail] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", sub: "" });

  const roleOptions = useMemo(
    () => ["All Roles", ...Array.from(new Set(users.map((u) => u.role)))],
    [users]
  );

  const triggerToast = (title: string, sub: string) => {
    setToastMessage({ title, sub });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const confirmDelete = async () => {
    if (!deleteEmail) return;
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 800));
    setUsers(users.filter((u) => u.email !== deleteEmail));
    triggerToast("Identity Purged", "Subject removed from central registry");
    setDeleteEmail(null);
    setIsDeleting(false);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "All Roles" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter, users]);

  return (
    <Layout title="Identity Registry" icon={UsersIcon}>
      {/* Purge Modal */}
      {deleteEmail && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div
            className={cn(
              "p-8 rounded-[2.5rem] border max-w-sm w-full text-center shadow-2xl",
              isDark ? "bg-[#0d0d12] border-white/10" : "bg-white"
            )}
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertOctagon className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-black mb-2 uppercase text-red-500">
              Purge Identity?
            </h3>
            <p className="text-[10px] text-gray-500 mb-8 font-mono tracking-widest uppercase">
              {deleteEmail}
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
                className="flex-1 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
                onClick={confirmDelete}
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
        <div className="fixed bottom-10 right-10 z-[1100] animate-in slide-in-from-bottom-5 fade-in">
          <div
            className={cn(
              "flex items-center gap-4 px-8 py-5 rounded-[2rem] shadow-2xl border",
              isDark
                ? "bg-[#111118] border-blue-500/50 text-blue-400"
                : "bg-white border-blue-100 text-blue-600"
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

      {/* Top Bar */}
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
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            Managing personnel authentication and clearance
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-12 rounded-xl bg-green-800 border-slate-700/50 hover:bg-slate-500/10 font-black text-[10px] uppercase tracking-widest"
          >
            <Download size={16} className="mr-2" /> Export CSV
          </Button>
          <Button
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="h-12 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 bg-blue-600 text-white"
          >
            <Plus size={16} className="mr-2" /> Register Subject
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div
        className={cn(
          "p-4 rounded-2xl mb-6 border flex flex-col md:flex-row gap-4 items-center",
          isDark ? "bg-[#111118] border-white/5" : "bg-white border-gray-100"
        )}
      >
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            placeholder="Search by name or email..."
            className={cn(
              "w-full pl-12 pr-4 py-3 rounded-xl text-sm outline-none",
              isDark
                ? "bg-black/20 border-white/10 text-white focus:border-blue-500/50"
                : "bg-gray-50 border-gray-200"
            )}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className={cn(
              "w-full pl-10 pr-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest outline-none appearance-none cursor-pointer",
              isDark
                ? "bg-black/20 border-white/10 text-white"
                : "bg-gray-50 border-gray-200"
            )}
          >
            {roleOptions.map((opt) => (
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

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.email}
            onClick={() => setDrawerUser(user)}
            className={cn(
              "p-8 rounded-[2.5rem] border transition-all cursor-pointer group relative",
              isDark
                ? "bg-[#111118] border-white/5 hover:border-blue-500/30"
                : "bg-white border-gray-100 shadow-sm hover:shadow-md"
            )}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center overflow-hidden border border-blue-500/5">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                ) : (
                  <span className="font-black text-blue-500 text-xl">
                    {user.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex gap-1  transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:text-blue-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedUser(user);
                    setIsModalOpen(true);
                  }}
                >
                  <Edit2 size={12} className="h-8 w-8 text-yellow-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:text-red-500 ml-5"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteEmail(user.email);
                  }}
                >
                  <Trash2 size={12} className="h-8 w-8 text-red-500" />
                </Button>
              </div>
            </div>

            <h4 className="font-black text-lg tracking-tight uppercase mb-1">
              {user.name}
            </h4>
            <p className="text-[10px] font-mono text-blue-500 font-bold uppercase tracking-tight mb-4">
              {user.email}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                {user.role}
              </span>
              <SquareArrowOutUpLeft
                size={14}
                className="group-hover:text-blue-500 transition-colors h-8 w-8 text-teal-500"
              />
            </div>
          </div>
        ))}
      </div>

      <UserDrawer
        user={drawerUser}
        isOpen={!!drawerUser}
        onClose={() => setDrawerUser(null)}
        isDark={isDark}
      />

      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(u) => {
            if (selectedUser)
              setUsers(
                users.map((x) => (x.email === selectedUser.email ? u : x))
              );
            else setUsers([...users, u]);
            setIsModalOpen(false);
            triggerToast("Registry Updated", "Subject data committed to core");
          }}
          initialData={selectedUser}
          isDark={isDark}
        />
      )}
    </Layout>
  );
};

export default AuthUsersPage;
