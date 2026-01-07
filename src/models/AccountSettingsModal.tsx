import React, { useEffect, useState, useRef } from "react";
import { X, Camera, User, Mail, AtSign, Loader2 } from "lucide-react";
import { Button } from "../component/ui/button";
import { cn } from "../lib/utils";

export interface UserProfile {
  fullName: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserProfile) => void;
  initialData: UserProfile;
  isDark: boolean;
}

export const AccountSettingsModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isDark,
}: AccountModalProps) => {
  const [formData, setFormData] = useState<UserProfile>(initialData);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setFormData(initialData);
  }, [initialData, isOpen]);

  // Handle Image Selection and Conversion to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
        setIsProcessing(false);
      };

      // Slight timeout to simulate system processing/optimization
      setTimeout(() => reader.readAsDataURL(file), 500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={cn(
          "w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200",
          isDark
            ? "bg-[#0d0d12] border border-white/10 text-white"
            : "bg-white text-gray-900 border border-gray-100"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "px-8 py-5 border-b flex justify-between items-center",
            isDark ? "border-white/5" : "border-gray-100"
          )}
        >
          <h3 className="font-black uppercase tracking-widest text-xs">
            Edit Global Profile
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="p-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
        >
          {/* Avatar Edit Section */}
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div
                className={cn(
                  "w-24 h-24 rounded-3xl border-4 overflow-hidden flex items-center justify-center",
                  isDark
                    ? "bg-black/40 border-white/10"
                    : "bg-gray-100 border-white shadow-inner"
                )}
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin text-blue-500" size={24} />
                ) : formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-3xl font-black text-blue-500">
                    {formData.fullName.charAt(0)}
                  </div>
                )}
              </div>

              {/* Trigger for hidden input */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2.5 bg-blue-600 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform hover:bg-blue-500"
              >
                <Camera size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-sm font-bold transition-all focus:ring-2 focus:ring-blue-500/20",
                    isDark
                      ? "bg-black/20 border-white/10 focus:border-blue-500/50"
                      : "bg-gray-50 border-gray-200"
                  )}
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Username Input */}
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">
                Network Handle
              </label>
              <div className="relative">
                <AtSign
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500/50"
                />
                <input
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-sm font-mono text-blue-500 transition-all focus:ring-2 focus:ring-blue-500/20",
                    isDark
                      ? "bg-black/20 border-white/10 focus:border-blue-500/50"
                      : "bg-gray-50 border-gray-200"
                  )}
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              className="text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              type="submit"
              className="text-[10px] font-black uppercase tracking-[0.2em] bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
            >
              Update Records
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
