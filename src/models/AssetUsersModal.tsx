import React, { useState, useRef, useEffect } from "react";
import { Camera, Plus, X, Monitor, Calendar, Briefcase } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";

interface User {
  name: string;
  role: string;
  status: string;
  email: string;
  avatar?: string;
  location?: string;
  // Allocation Fields
  assetName?: string;
  assetId?: string;
  department?: string;
  date?: string;
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
    assetName: "",
    assetId: "",
    department: "",
    date: new Date().toISOString().split("T")[0],
  });

  if (!isOpen) return null;

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        assetName: initialData.assetName || "",
        assetId: initialData.assetId || "",
        department: initialData.department || "",
        date: initialData.date || new Date().toISOString().split("T")[0],
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
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative w-full max-w-lg rounded-[2.5rem] p-8 border shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]",
          isDark
            ? "bg-[#0d0d12] border-white/10 text-white"
            : "bg-white border-gray-200"
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-red-500 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center mb-8">
          <div
            className="relative group cursor-pointer mb-4"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-20 h-20 rounded-[2rem] border-4 border-blue-500/20 overflow-hidden flex items-center justify-center bg-black/20">
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
              <Camera size={20} className="text-white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
          <h2 className="text-lg font-black uppercase tracking-tighter">
            Identity Registration
          </h2>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
        >
          {/* Section 1: Core Identity */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-blue-500 ml-2">
                  Full Name
                </label>
                <input
                  required
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all",
                    isDark
                      ? "bg-white/5 border-white/10 focus:border-blue-500/50"
                      : "bg-gray-50 border-gray-200"
                  )}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-blue-500 ml-2">
                  Email
                </label>
                <input
                  required
                  type="email"
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border outline-none text-sm font-mono",
                    isDark
                      ? "bg-white/5 border-white/10 focus:border-blue-500/50"
                      : "bg-gray-50 border-gray-200"
                  )}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Section 2: Asset Allocation */}
          <div
            className={cn(
              "p-6 rounded-3xl border space-y-4",
              isDark
                ? "bg-white/[0.02] border-white/5"
                : "bg-gray-50 border-gray-100"
            )}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2 mb-2">
              <Monitor size={14} /> Hardware Allocation
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">
                  Asset Name
                </label>
                <input
                  placeholder="e.g. MacBook Pro"
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border outline-none text-xs",
                    isDark
                      ? "bg-black/40 border-white/5"
                      : "bg-white border-gray-200"
                  )}
                  value={formData.assetName}
                  onChange={(e) =>
                    setFormData({ ...formData, assetName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">
                  System Serial
                </label>
                <input
                  placeholder="SYS-XXX-000"
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border outline-none text-xs font-mono",
                    isDark
                      ? "bg-black/40 border-white/5"
                      : "bg-white border-gray-200"
                  )}
                  value={formData.assetId}
                  onChange={(e) =>
                    setFormData({ ...formData, assetId: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">
                  Cost Center
                </label>
                <input
                  placeholder="Department"
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border outline-none text-xs",
                    isDark
                      ? "bg-black/40 border-white/5"
                      : "bg-white border-gray-200"
                  )}
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">
                  Assignment Date
                </label>
                <input
                  type="date"
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border outline-none text-xs",
                    isDark
                      ? "bg-black/40 border-white/5"
                      : "bg-white border-gray-200"
                  )}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 rounded-xl font-bold uppercase text-[10px]"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20"
            >
              Commit Identity
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
