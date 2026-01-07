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
  AlertTriangle,
  BellRing,
  History,
  Globe,
  Mail,
  ShieldCheck,
  Fingerprint,
  Activity,
  LogOut,
  MapPin,
  SquareArrowOutUpLeft,
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";
import { UserModal } from "../models/UserModal";

// --- Types ---
export interface User {
  name: string;
  role: string;
  status: string;
  email: string;
  avatar?: string;
  location?: string;
}

// --- Sub-Component: User Drawer (Profile & Logs) ---
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
    <>
      <div
        className={cn(
          "fixed inset-0 z-[600] bg-black/60 backdrop-blur-sm transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed top-0 right-0 z-[700] h-full w-full max-w-md border-l transition-transform duration-500 ease-in-out transform shadow-2xl overflow-y-auto",
          isDark ? "bg-[#0d0d12] border-white/10" : "bg-white border-gray-200",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/5 bg-inherit/80 backdrop-blur-md">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
            Subject Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 transition-colors text-gray-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-24 h-24 rounded-[2rem] border-4 border-blue-500/20 mb-4 overflow-hidden bg-black/20 flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  className="w-full h-full object-cover"
                  alt={user.name}
                />
              ) : (
                <span className="text-3xl font-black text-blue-500">
                  {user.name.charAt(0)}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-black tracking-tighter mb-1">
              {user.name}
            </h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">
                {user.status}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {[
              {
                icon: <Mail size={14} />,
                label: "Network Email",
                val: user.email,
              },
              {
                icon: <ShieldCheck size={14} />,
                label: "Security Role",
                val: user.role,
              },
              {
                icon: <MapPin size={14} />,
                label: "Last Known Loc",
                val: user.location || "Unknown",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={cn(
                  "p-4 rounded-2xl border",
                  isDark
                    ? "bg-white/5 border-white/5"
                    : "bg-gray-50 border-gray-100"
                )}
              >
                <p className="text-[8px] font-black uppercase text-gray-500 mb-1 flex items-center gap-2">
                  {item.icon} {item.label}
                </p>
                <p className="text-xs font-bold font-mono">{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

// --- Main Dashboard ---
const UsersPage = () => {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerUser, setDrawerUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toasts, setToasts] = useState<
    { id: number; message: string; type: string }[]
  >([]);

  const addToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000
    );
  };

  const downloadCSV = () => {
    const headers = "Name,Email,Role,Status,Location\n";
    const rows = users
      .map(
        (u) =>
          `${u.name},${u.email},${u.role},${u.status},${u.location || "N/A"}`
      )
      .join("\n");
    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURI(headers + rows);
    link.download = "registry_export.csv";
    link.click();
    addToast("CSV Exported");
  };

  return (
    <Layout title="Registry" icon={UsersIcon}>
      {/* Notifications */}
      <div className="fixed bottom-8 right-8 z-[1000] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "px-6 py-4 rounded-2xl border shadow-2xl flex items-center gap-3 animate-in slide-in-from-right",
              t.type === "success"
                ? "bg-black border-emerald-500/50 text-emerald-400"
                : "bg-black border-red-500/50 text-red-400"
            )}
          >
            <BellRing size={14} />{" "}
            <span className="text-[10px] font-black uppercase tracking-widest">
              {t.message}
            </span>
          </div>
        ))}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div
            className={cn(
              "p-8 rounded-[2rem] border max-w-sm w-full text-center",
              isDark ? "bg-[#0d0d12] border-white/10" : "bg-white"
            )}
          >
            <AlertTriangle className="mx-auto mb-4 text-red-500" size={40} />
            <h3 className="text-xl font-black mb-2">Purge Record?</h3>
            <p className="text-xs text-gray-500 mb-6">
              Confirm deletion for {deleteConfirm}
            </p>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setDeleteConfirm(null)}
              >
                Abort
              </Button>
              <Button
                className="flex-1 bg-red-600"
                onClick={() => {
                  setUsers(users.filter((u) => u.email !== deleteConfirm));
                  setDeleteConfirm(null);
                  addToast("Purged", "error");
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Identity Control
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <Search size={14} className="text-gray-500" />
            <input
              placeholder="Search..."
              className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest text-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={downloadCSV}
            variant="outline"
            className="rounded-xl border-white/10"
          >
            <Download size={16} className="mr-2" /> Export
          </Button>
          <Button
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 rounded-xl px-6"
          >
            <Plus size={16} className="mr-2" /> New Entry
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users
          .filter((u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((user) => (
            <div
              key={user.email}
              onClick={() => setDrawerUser(user)}
              className={cn(
                "p-6 rounded-[2.5rem] border transition-all cursor-pointer group relative",
                isDark
                  ? "bg-[#111118] border-white/5 hover:border-blue-500/30"
                  : "bg-white border-gray-100 shadow-sm"
              )}
            >
              <div className="absolute top-6 right-6 flex gap-2  transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedUser(user);
                    setIsModalOpen(true);
                  }}
                  className="p-2 hover:text-blue-500"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirm(user.email);
                  }}
                  className="p-2 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 mb-4 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                ) : (
                  <span className="font-black text-blue-500">
                    {user.name.charAt(0)}
                  </span>
                )}
              </div>
              <h4 className="font-black tracking-tight">{user.name}</h4>
              <p className="text-[10px] font-mono text-gray-500 uppercase">
                {user.email}
              </p>{" "}
              <SquareArrowOutUpLeft
                size={14}
                className="absolute down-6 right-6 flex gap-2"
              />
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
            addToast("Registry Updated");
          }}
          initialData={selectedUser}
          isDark={isDark}
        />
      )}
    </Layout>
  );
};

export default UsersPage;
