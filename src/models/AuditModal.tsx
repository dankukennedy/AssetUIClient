import React, { useEffect, useState } from "react";
import { X, UserPlus, AlertCircle } from "lucide-react";
import { Button } from "../component/ui/button";
import { cn } from "../lib/utils";

export interface Audit {
  id: string;
  assetId: string;
  assetName: string;
  userId: string;
  userName: string;
  date: string;
  department: string;
}

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Audit) => void;
  initialData?: Audit | null;
  isDark: boolean;
}

export const AuditModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isDark,
}: AuditModalProps) => {
  const [formData, setFormData] = useState<Audit>({
    id: "",
    assetId: "",
    assetName: "",
    userId: "",
    userName: "",
    date: "",
    department: "Engineering",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: `ALC-${Math.floor(100 + Math.random() * 900)}`,
        assetId: "",
        assetName: "",
        userId: "",
        userName: "",
        date: new Date().toISOString().split("T")[0],
        department: "Engineering",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={cn(
          "w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200",
          isDark
            ? "bg-[#0d0d12] border border-white/10 text-white"
            : "bg-white text-gray-900 border border-gray-200"
        )}
      >
        <div
          className={cn(
            "px-6 py-4 border-b flex justify-between items-center",
            isDark ? "border-white/5" : "border-gray-100"
          )}
        >
          <h3 className="font-black uppercase tracking-tight text-xs flex items-center gap-2">
            <UserPlus size={14} className="text-blue-500" />
            {initialData ? "Modify Assignment" : "New Asset Allocation"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="p-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">
                Asset ID
              </label>
              <input
                required
                placeholder="AST-000"
                className={cn(
                  "w-full px-4 py-2 rounded-lg border outline-none font-mono text-xs",
                  isDark
                    ? "bg-black/20 border-white/10 text-blue-400"
                    : "bg-gray-50 border-gray-200"
                )}
                value={formData.assetId}
                onChange={(e) =>
                  setFormData({ ...formData, assetId: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">
                Department
              </label>
              <select
                className={cn(
                  "w-full px-4 py-2 rounded-lg border outline-none text-xs font-bold",
                  isDark
                    ? "bg-black/20 border-white/10"
                    : "bg-gray-50 border-gray-200"
                )}
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              >
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="HR">HR</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">
              Employee Name
            </label>
            <input
              required
              placeholder="e.g. John Doe"
              className={cn(
                "w-full px-4 py-2 rounded-lg border outline-none focus:border-blue-500",
                isDark
                  ? "bg-black/20 border-white/10"
                  : "bg-gray-50 border-gray-200"
              )}
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">
              Hardware Model
            </label>
            <input
              required
              placeholder="e.g. MacBook Pro M3"
              className={cn(
                "w-full px-4 py-2 rounded-lg border outline-none focus:border-blue-500",
                isDark
                  ? "bg-black/20 border-white/10"
                  : "bg-gray-50 border-gray-200"
              )}
              value={formData.assetName}
              onChange={(e) =>
                setFormData({ ...formData, assetName: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              className="text-xs font-black uppercase"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              type="submit"
              className="text-xs font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700"
            >
              Confirm Assignment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
