import React from 'react';
import { X, Zap, Search, PlusCircle } from 'lucide-react';
import { Button } from '../component/ui/button';
import { cn } from '../lib/utils';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const DashboardModal = ({ isOpen, onClose, isDark }: DashboardModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={cn(
        "w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200",
        isDark ? "bg-[#0d0d12] border border-white/10 text-white" : "bg-white text-gray-900 border border-gray-200"
      )}>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Zap size={20} />
              </div>
              <h3 className="font-black uppercase tracking-widest text-sm">Quick Command</h3>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors"><X size={20} /></button>
          </div>

          <div className="space-y-3">
            <button className={cn(
              "w-full flex items-center justify-between p-4 rounded-2xl border transition-all group",
              isDark ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-gray-50 border-gray-100 hover:bg-blue-50"
            )}>
              <div className="flex items-center gap-4">
                <PlusCircle className="text-blue-500" size={20} />
                <div className="text-left">
                  <p className="text-sm font-bold">New Inventory Entry</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black">Register new hardware</p>
                </div>
              </div>
              <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">CMD+N</span>
            </button>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                placeholder="Global Search..." 
                className={cn(
                  "w-full pl-12 pr-4 py-4 rounded-2xl border outline-none font-bold text-sm",
                  isDark ? "bg-black/20 border-white/10" : "bg-gray-50 border-gray-200"
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};