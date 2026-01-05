import React, { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '../component/ui/button';
import { cn } from '../lib/utils';

export interface Asset {
  id: string;
  name: string;
  type: string;
  status: string;
  purchaseDate?: string;
  assignedTo?: string;
}

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Asset) => void;
  initialData?: Asset | null;
  isDark: boolean;
}

export const AssetModal = ({ isOpen, onClose, onSave, initialData, isDark }: AssetModalProps) => {
  const [formData, setFormData] = useState<Asset>({
    id: '', name: '', type: 'Laptop', status: 'Active'
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ 
        id: `AST-${Math.floor(100 + Math.random() * 900)}`, 
        name: '', 
        type: 'Laptop', 
        status: 'Active' 
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  const validateForm = () => {
    if (!formData.name.trim()) return "Asset Name is required.";
    if (!/^AST-\d{3,}$/.test(formData.id)) return "Invalid Asset ID format (AST-XXX).";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={cn(
        "w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200",
        isDark ? "bg-[#0d0d12] border border-white/10 text-white" : "bg-white text-gray-900 border border-gray-200"
      )}>
        <div className={cn("px-6 py-4 border-b flex justify-between items-center", isDark ? "border-white/5" : "border-gray-100")}>
          <h3 className="font-black uppercase tracking-tight text-sm">{initialData ? 'Update Asset' : 'Register Asset'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors"><X size={20} /></button>
        </div>

        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">ID</label>
              <input 
                readOnly={!!initialData}
                className={cn("w-full px-4 py-2 rounded-lg border outline-none font-mono text-xs", 
                isDark ? "bg-black/40 border-white/10 text-blue-400" : "bg-gray-100 border-gray-200 text-blue-600")}
                value={formData.id} 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">Type</label>
              <select 
                className={cn("w-full px-4 py-2 rounded-lg border outline-none text-xs font-bold", isDark ? "bg-black/20 border-white/10" : "bg-gray-50 border-gray-200")}
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Laptop">Laptop</option>
                <option value="Mobile">Mobile</option>
                <option value="Peripheral">Peripheral</option>
                <option value="Audio">Audio</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">Hardware Name</label>
            <input 
              placeholder="e.g. Dell UltraSharp 27"
              className={cn("w-full px-4 py-2 rounded-lg border outline-none transition-all focus:border-blue-500", isDark ? "bg-black/20 border-white/10" : "bg-gray-50 border-gray-200")}
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
            <Button variant="ghost" type="button" onClick={onClose} className="text-xs font-black uppercase">Cancel</Button>
            <Button variant="default" type="submit" className="text-xs font-black uppercase tracking-widest">Save Record</Button>
          </div>
        </form>
      </div>
    </div>
  );
};