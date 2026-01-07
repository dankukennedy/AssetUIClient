import React, { useState } from "react";
import { X, Trash2, CheckCircle } from "lucide-react";
import { Button } from "../component/ui/button";
import { cn } from "../lib/utils";

export const DisposalModal = ({ isOpen, onClose, onSave, isDark }: any) => {
  const [formData, setFormData] = useState({
    assetId: "",
    method: "Recycle",
    company: "",
    certificateNo: "",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={cn(
          "w-full max-w-md rounded-2xl shadow-2xl border",
          isDark ? "bg-[#0d0d12] border-white/10 text-white" : "bg-white"
        )}
      >
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-black uppercase text-xs flex items-center gap-2">
            <Trash2 size={14} /> Physical Disposal Log
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
          }}
        >
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
              Asset Reference
            </label>
            <input
              required
              className={cn(
                "w-full px-4 py-2 rounded-lg border outline-none",
                isDark ? "bg-black/20 border-white/10" : "bg-gray-50"
              )}
              placeholder="AST-XXX"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
                Disposal Method
              </label>
              <select
                className={cn(
                  "w-full px-4 py-2 rounded-lg border outline-none text-xs",
                  isDark ? "bg-black/20 border-white/10" : "bg-gray-50"
                )}
              >
                <option>Physical Destruction</option>
                <option>Secure Recycle</option>
                <option>Donation</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
                Certificate #
              </label>
              <input
                className={cn(
                  "w-full px-4 py-2 rounded-lg border outline-none text-xs",
                  isDark ? "bg-black/20 border-white/10" : "bg-gray-50"
                )}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Submit Certification
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
