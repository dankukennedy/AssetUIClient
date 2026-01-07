import React, { useEffect, useState } from "react";
import { X, ShieldAlert } from "lucide-react";
import { Button } from "../component/ui/button";
import { cn } from "../lib/utils";

export interface ArchiveRecord {
  id: string;
  fileName: string;
  type: string;
  dateArchived: string;
  size: string;
}

interface ArchivesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ArchiveRecord) => void;
  initialData?: ArchiveRecord | null;
  isDark: boolean;
}

export const ArchivesModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isDark,
}: ArchivesModalProps) => {
  const [formData, setFormData] = useState<ArchiveRecord>({
    id: "",
    fileName: "",
    type: "Document",
    dateArchived: "",
    size: "",
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else
      setFormData({
        id: `ARC-${new Date().getFullYear()}-${Math.floor(
          100 + Math.random() * 900
        )}`,
        fileName: "",
        type: "Document",
        dateArchived: new Date().toISOString().split("T")[0],
        size: "",
      });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={cn(
          "w-full max-w-md rounded-2xl shadow-2xl overflow-hidden",
          isDark ? "bg-[#0d0d12] border border-white/10 text-white" : "bg-white"
        )}
      >
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-black uppercase tracking-tight text-sm">
            Archive File Management
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form
          className="p-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
        >
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">
              Filename
            </label>
            <input
              required
              className={cn(
                "w-full px-4 py-2 rounded-lg border outline-none",
                isDark
                  ? "bg-black/20 border-white/10"
                  : "bg-gray-50 border-gray-200"
              )}
              value={formData.fileName}
              onChange={(e) =>
                setFormData({ ...formData, fileName: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">
                Type
              </label>
              <select
                className={cn(
                  "w-full px-4 py-2 rounded-lg border outline-none text-xs",
                  isDark
                    ? "bg-black/20 border-white/10"
                    : "bg-gray-50 border-gray-200"
                )}
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="Document">Document</option>
                <option value="Database">Database</option>
                <option value="Technical">Technical</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">
                Storage Size
              </label>
              <input
                placeholder="e.g. 500MB"
                className={cn(
                  "w-full px-4 py-2 rounded-lg border outline-none font-mono text-xs",
                  isDark
                    ? "bg-black/20 border-white/10"
                    : "bg-gray-50 border-gray-200"
                )}
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="default">Save to Vault</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
