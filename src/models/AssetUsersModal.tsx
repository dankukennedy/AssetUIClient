import React, { useState, useRef, useEffect } from "react";
import { Camera, Plus, X } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";

interface User {
  name: string;
  role: string;
  status: string;
  email: string;
  avatar?: string;
  location?: string; // Added to match your Page interface
}

interface AssetUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  initialData?: User | null;
  isDark: boolean;
}

export const AssetUserModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isDark,
}: AssetUserModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    role: "User",
    status: "Active",
    avatar: "",
  });

  // --- FIX 1: Early return if not open ---
  if (!isOpen) return null;

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        email: "",
        role: "User",
        status: "Active",
        avatar: "",
      });
    }
  }, [initialData, isOpen]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData({ ...formData, avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    // --- FIX 2: Added z-index and ensure clicks outside can trigger close if desired ---
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative w-full max-w-md rounded-[2.5rem] p-8 border shadow-2xl animate-in zoom-in-95 duration-200",
          isDark
            ? "bg-[#0d0d12] border-white/10 text-white"
            : "bg-white border-gray-200"
        )}
      >
        {/* Close button in top right */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-red-500 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-8">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-24 h-24 rounded-[2rem] border-4 border-blue-500/20 overflow-hidden flex items-center justify-center bg-black/20">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Plus className="text-blue-500" />
              )}
            </div>
            <div className="absolute inset-0 bg-blue-600/60 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
            // The Page component handles the onClose call within handleSave
          }}
        >
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">
              Full Name
            </label>
            <input
              required
              placeholder="e.g. John Doe"
              className={cn(
                "w-full px-4 py-3 rounded-xl border outline-none transition-all",
                isDark
                  ? "bg-white/5 border-white/10 focus:border-blue-500/50 text-white"
                  : "bg-gray-50 border-gray-200 focus:border-blue-500"
              )}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">
              Email Address
            </label>
            <input
              required
              type="email"
              placeholder="name@company.com"
              className={cn(
                "w-full px-4 py-3 rounded-xl border outline-none font-mono text-sm transition-all",
                isDark
                  ? "bg-white/5 border-white/10 focus:border-blue-500/50 text-white"
                  : "bg-gray-50 border-gray-200 focus:border-blue-500"
              )}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">
                Role
              </label>
              <select
                className={cn(
                  "w-full px-4 py-3 rounded-xl border outline-none text-xs font-bold",
                  isDark
                    ? "bg-[#1a1a24] border-white/10 text-white"
                    : "bg-gray-50 border-gray-200"
                )}
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="Administrator">Admin</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
                <option value="Auditor">Auditor</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">
                Status
              </label>
              <select
                className={cn(
                  "w-full px-4 py-3 rounded-xl border outline-none text-xs font-bold",
                  isDark
                    ? "bg-[#1a1a24] border-white/10 text-white"
                    : "bg-gray-50 border-gray-200"
                )}
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 rounded-xl font-bold uppercase text-[10px] tracking-widest"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-blue-500/20"
            >
              Save Identity
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
