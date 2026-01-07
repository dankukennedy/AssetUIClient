import React, { useState } from "react";
import { X, BarChart, FileJson, FileType } from "lucide-react";
import { Button } from "../component/ui/button";
import { cn } from "../lib/utils";

export const ReportsModal = ({ isOpen, onClose, isDark }: any) => {
  const [type, setType] = useState("Inventory Summary");

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
            <BarChart size={14} /> Intelligence Engine
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-3 tracking-widest">
              Select Report Parameters
            </label>
            <div className="grid grid-cols-1 gap-3">
              {[
                "Inventory Summary",
                "User Allocation Map",
                "Depreciation Forecast",
                "Maintenance Logs",
              ].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "text-left px-4 py-3 rounded-xl border text-sm font-bold transition-all",
                    type === t
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-white/5 bg-white/5 text-gray-400"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <FileJson size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <FileType size={16} />
              </Button>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 font-black uppercase text-[10px]">
              Compile Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
