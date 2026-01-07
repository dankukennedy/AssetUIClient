import React, { useState } from "react";
import { X, PowerOff, AlertCircle } from "lucide-react";
import { Button } from "../component/ui/button";
import { cn } from "../lib/utils";

export interface DecomRecord {
  id: string;
  assetId: string;
  reason: string;
  decommissionDate: string;
  approvedBy: string;
}

export const DecommissionModal = ({ isOpen, onClose, onSave, isDark }: any) => {
  const [formData, setFormData] = useState<DecomRecord>({
    id: `DEC-${Math.floor(1000 + Math.random() * 9000)}`,
    assetId: "",
    reason: "",
    decommissionDate: "",
    approvedBy: "",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={cn(
          "w-full max-w-md rounded-2xl shadow-2xl border",
          isDark ? "bg-[#0d0d12] border-red-500/20 text-white" : "bg-white"
        )}
      >
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-black text-red-500 uppercase text-xs flex items-center gap-2">
            <PowerOff size={14} /> Decommission protocol
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>
        <form
          className="p-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
            onClose();
          }}
        >
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] text-red-400 flex gap-2">
            <AlertCircle size={14} />{" "}
            <span>
              Warning: This action marks hardware as permanently inactive.
            </span>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
              Target Asset ID
            </label>
            <input
              required
              placeholder="AST-XXX"
              className={cn(
                "w-full px-4 py-2 rounded-lg border outline-none font-mono",
                isDark ? "bg-black/20 border-white/10" : "bg-gray-50"
              )}
              value={formData.assetId}
              onChange={(e) =>
                setFormData({ ...formData, assetId: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
              Reason for removal
            </label>
            <textarea
              className={cn(
                "w-full px-4 py-2 rounded-lg border outline-none h-24",
                isDark ? "bg-black/20 border-white/10" : "bg-gray-50"
              )}
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" type="button" onClick={onClose}>
              Abort
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              Decommission
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
