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

export const UserModal = ({
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

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else
      setFormData({
        name: "",
        email: "",
        role: "User",
        status: "Active",
        avatar: "",
      });
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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div
        className={cn(
          "w-full max-w-md rounded-[2.5rem] p-8 border animate-in zoom-in duration-200",
          isDark ? "bg-[#0d0d12] border-white/10 text-white" : "bg-white"
        )}
      >
        <div className="flex justify-center mb-8">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-24 h-24 rounded-[2rem] border-4 border-blue-500/20 overflow-hidden flex items-center justify-center bg-black/20">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
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
          }}
        >
          <input
            required
            placeholder="Full Name"
            className={cn(
              "w-full px-4 py-3 rounded-xl border outline-none",
              isDark
                ? "bg-white/5 border-white/10 focus:border-blue-500/50"
                : "bg-gray-50"
            )}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="Email"
            className={cn(
              "w-full px-4 py-3 rounded-xl border outline-none font-mono",
              isDark
                ? "bg-white/5 border-white/10 focus:border-blue-500/50"
                : "bg-gray-50"
            )}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              className={cn(
                "px-4 py-3 rounded-xl border outline-none",
                isDark ? "bg-white/5 border-white/10" : "bg-gray-50"
              )}
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="Administrator">Admin</option>
              <option value="Manager">Manager</option>
              <option value="User">User</option>
            </select>
            <select
              className={cn(
                "px-4 py-3 rounded-xl border outline-none",
                isDark ? "bg-white/5 border-white/10" : "bg-gray-50"
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
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-[2] bg-blue-600">
              Save Identity
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
