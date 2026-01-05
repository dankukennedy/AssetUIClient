import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../component/ui/button';
import { cn } from '../lib/utils';

interface Block {
  blockId?: string;
  name: string;
}

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Block) => void;
  initialData?: Block | null;
  isDark: boolean;
}

export const BlockModal = ({ isOpen, onClose, onSave, initialData, isDark }: BlockModalProps) => {
  const [formData, setFormData] = useState<Block>({
    name: '',
    blockId: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '',  blockId: '', });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={cn(
        "w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transition-all transform",
        isDark ? "bg-[#111118] border border-white/10" : "bg-white"
      )}>
        {/* Header */}
        <div className={cn("px-6 py-4 border-b flex justify-between items-center", isDark ? "border-white/5" : "border-gray-100")}>
          <h3 className="font-bold text-lg">{initialData ? 'Edit Block' : 'Create New Block'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>

            <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Block Name</label>
            <input
              required
              type="text"
              className={cn(
                "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500/20 transition-all opacity-50 disabled:cursor-not-allowed",
                isDark ? "bg-black/20 border-white/10 text-white" : "bg-gray-50 border-gray-200"
              )}
              value={formData. blockId}
              onChange={(e) => setFormData({...formData,  blockId: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Block Name</label>
            <input
              required
              className={cn(
                "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                isDark ? "bg-black/20 border-white/10 text-white" : "bg-gray-50 border-gray-200"
              )}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>


          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="default" type="submit">
              {initialData ? 'Update Block' : 'Create Block'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};