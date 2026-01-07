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
}

interface UserModalProps {
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
}: UserModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    role: "User",
    status: "Active",
    avatar: "",
  });

  // Synchronize internal state with initialData when modal opens
  useEffect(() => {
    if (isOpen) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className={cn(
          "w-full max-w-md rounded-[2.5rem] p-8 border animate-in zoom-in duration-200 shadow-2xl",
          isDark
            ? "bg-[#0d0d12] border-white/10 text-white"
            : "bg-white border-gray-200"
        )}
      >
        {/* Header & Avatar Upload */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="relative group cursor-pointer mb-4"
            onClick={() => fileInputRef.current?.click()}
          >
            <div
              className={cn(
                "w-24 h-24 rounded-[2rem] border-4 overflow-hidden flex items-center justify-center transition-all",
                isDark
                  ? "border-white/5 bg-white/5"
                  : "border-gray-100 bg-gray-50"
              )}
            >
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              ) : (
                <Plus size={32} className="text-blue-500" />
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
          <h3 className="font-black uppercase tracking-tighter text-lg">
            {initialData ? "Modify Identity" : "New Registration"}
          </h3>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
        >
          {/* Name Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">
              Legal Name
            </label>
            <input
              required
              placeholder="e.g. Alexander Pierce"
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

          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">
              Network Email
            </label>
            <input
              required
              type="email"
              placeholder="name@company.io"
              className={cn(
                "w-full px-4 py-3 rounded-xl border outline-none font-mono text-sm transition-all",
                isDark
                  ? "bg-white/5 border-white/10 focus:border-blue-500/50 text-blue-400"
                  : "bg-gray-50 border-gray-200 focus:border-blue-500 text-blue-600"
              )}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Role Select */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">
                Access Level
              </label>
              <select
                className={cn(
                  "w-full px-4 py-3 rounded-xl border outline-none font-bold text-xs uppercase tracking-tight",
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-gray-50 border-gray-200"
                )}
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="Administrator">Administrator</option>
                <option value="Manager">Manager</option>
                <option value="Lead Designer">Lead Designer</option>
                <option value="Developer">Developer</option>
                <option value="User">Standard User</option>
              </select>
            </div>

            {/* Status Select */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">
                Account State
              </label>
              <select
                className={cn(
                  "w-full px-4 py-3 rounded-xl border outline-none font-bold text-xs uppercase tracking-tight",
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-gray-50 border-gray-200"
                )}
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 rounded-2xl font-black text-[10px] uppercase tracking-widest"
              onClick={onClose}
            >
              Abort
            </Button>
            <Button
              type="submit"
              className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20"
            >
              Commit Identity
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
