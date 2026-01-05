import React, { useState, useMemo } from 'react';
import { Layout } from '../component/Layout';
import { 
  Box, Plus, Edit2, Trash2, Search, Filter, 
  SquareArrowOutUpLeft, ChevronLeft, ChevronRight, X, Cpu, Calendar, User,
  Download, CheckCircle2 
} from 'lucide-react';
import { useTheme } from '../component/theme-provider';
import { cn } from '../lib/utils';
import { Button } from "../component/ui/button";
import { AssetModal, type Asset} from '../models/AssetModel';

const AssetManagement = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);
  const [showToast, setShowToast] = useState(false); // Toast state

  const itemsPerPage = 5;

  const [assets, setAssets] = useState<Asset[]>([
    { id: "AST-001", name: "MacBook Pro", type: "Laptop", status: "Active", purchaseDate: "2023-10-12", assignedTo: "Edem" },
    { id: "AST-002", name: "Dell Monitor", type: "Peripheral", status: "In Repair", purchaseDate: "2024-01-05" },
    { id: "AST-003", name: "iPhone 15", type: "Mobile", status: "Active", assignedTo: "Sarah Smith" },
    { id: "AST-004", name: "Logitech Mouse", type: "Peripheral", status: "Retired" },
    { id: "AST-005", name: "iPad Air", type: "Tablet", status: "Active" },
    { id: "AST-006", name: "ThinkPad X1", type: "Laptop", status: "Active" },
  ]);

  // --- Logic: CSV Download & Toast ---
  const downloadCSV = () => {
    const headers = ["ID", "Name", "Type", "Status", "Purchase Date", "Assigned To"];
    const csvContent = [
      headers.join(","),
      ...assets.map(asset => [
        asset.id,
        `"${asset.name}"`,
        asset.type,
        asset.status,
        asset.purchaseDate || "N/A",
        `"${asset.assignedTo || "Unassigned"}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `asset_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Trigger Toast Notification
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // --- Logic: Search & Filter ---
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            asset.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || asset.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, assets]);

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssets = filteredAssets.slice(startIndex, startIndex + itemsPerPage);

  // --- Handlers ---
  const handleSaveAsset = (assetData: Asset) => {
    if (selectedAsset) {
      setAssets(assets.map(a => a.id === selectedAsset.id ? assetData : a));
    } else {
      setAssets([assetData, ...assets]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if(window.confirm("Are you sure you want to remove this asset?")) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  return (
    <Layout title="Asset Management" icon={Box}>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={cn(
            "flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border",
            isDark ? "bg-[#111118] border-emerald-500/50 text-emerald-400" : "bg-white border-emerald-100 text-emerald-600"
          )}>
            <CheckCircle2 size={20} />
            <div className="flex flex-col">
              <span className="text-sm font-black">Export Successful</span>
              <span className="text-[10px] opacity-70 uppercase tracking-widest">CSV generated successfully</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className={cn("text-2xl font-black tracking-tight", isDark ? "text-white" : "text-gray-900")}>Asset Registry</h2>
          <p className="text-sm text-gray-500">Inventory and Lifecycle Management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-slate-700/50 hover:bg-slate-500/10" 
            onClick={downloadCSV}
          >
            <Download size={18} /> Export CSV
          </Button>
          <Button className="flex items-center gap-2 shadow-lg shadow-blue-500/20" onClick={() => { setSelectedAsset(null); setIsModalOpen(true); }}>
            <Plus size={18} /> Add Asset
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className={cn("p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm", isDark ? "bg-[#111118] border border-white/5" : "bg-white border border-gray-100")}>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            placeholder="Filter hardware..." 
            className={cn("w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none", isDark ? "bg-black/20 border-white/10 text-white" : "bg-gray-50 border-gray-200")} 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
          />
        </div>
        <select className={cn("px-3 py-2 rounded-lg text-sm outline-none w-full md:w-48", isDark ? "bg-black/20 border border-white/10 text-white font-bold" : "bg-gray-50 border border-gray-200 font-bold")} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="In Repair">In Repair</option>
          <option value="Retired">Retired</option>
        </select>
      </div>

      {/* Table */}
      <div className={cn("rounded-xl border transition-all overflow-hidden", isDark ? "border-white/5 bg-[#111118]" : "border-gray-100 bg-white shadow-sm")}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={cn("text-[10px] uppercase tracking-widest font-black", isDark ? "bg-white/5 text-gray-400" : "bg-gray-50 text-gray-500")}>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Hardware</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDark ? "divide-white/5" : "divide-gray-50")}>
              {paginatedAssets.map((asset) => (
                <tr key={asset.id} className={cn("text-sm transition-colors", isDark ? "hover:bg-white/5" : "hover:bg-blue-50/50")}>
                  <td className="px-6 py-4 font-mono text-xs text-blue-500 font-bold tracking-tighter">{asset.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={cn("font-bold", isDark ? "text-gray-200" : "text-gray-700")}>{asset.name}</span>
                      <span className="text-[10px] text-gray-500 uppercase font-black">{asset.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-black uppercase",
                      asset.status === "Active" ? "bg-green-500/10 text-green-500" : 
                      asset.status === "In Repair" ? "bg-orange-500/10 text-orange-500" : "bg-red-500/10 text-red-500"
                    )}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" onClick={() => setViewingAsset(asset)}><SquareArrowOutUpLeft size={14}/></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" onClick={() => { setSelectedAsset(asset); setIsModalOpen(true); }}><Edit2 size={14}/></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(asset.id)}><Trash2 size={14}/></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className={cn("px-6 py-4 flex items-center justify-between border-t", isDark ? "border-white/5 bg-white/5" : "border-gray-100 bg-gray-50/30")}>
          <span className="text-xs text-gray-500 font-mono italic">INV: {filteredAssets.length} UNITS</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft size={14} /></Button>
            <span className="text-[10px] font-black w-12 text-center">{currentPage} / {totalPages || 1}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}><ChevronRight size={14} /></Button>
          </div>
        </div>
      </div>

      {/* --- SIDE DETAILS DRAWER --- */}
      {viewingAsset && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setViewingAsset(null)} />
          <aside className={cn(
            "relative w-full max-w-lg h-full p-10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] animate-slide-in-right overflow-y-auto border-l",
            isDark ? "bg-[#0d0d12] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"
          )}>
            <button onClick={() => setViewingAsset(null)} className="absolute top-6 right-6 text-slate-500 hover:text-red-500 transition-colors"><X size={24} /></button>
            <header className="mb-10">
              <span className="px-3 py-1 rounded-lg text-[10px] font-black border border-blue-500/50 text-blue-500 mb-4 inline-block">{viewingAsset.type.toUpperCase()}</span>
              <h2 className="text-4xl font-black mb-2 tracking-tighter">{viewingAsset.name}</h2>
              <p className="font-mono text-blue-500 text-sm font-bold uppercase tracking-widest">{viewingAsset.id}</p>
            </header>
            
            <section className="space-y-8">
              <div className={cn("rounded-2xl p-6 border", isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100 shadow-inner")}>
                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Hardware Profile</h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm font-mono">
                  <div className="text-slate-500 uppercase text-[10px] font-black">Purchase Date</div>
                  <div className="text-slate-200">{viewingAsset.purchaseDate || 'N/A'}</div>
                  <div className="text-slate-500 uppercase text-[10px] font-black">Owner / Assigned</div>
                  <div className="text-slate-200 flex items-center gap-2"><User size={12}/> {viewingAsset.assignedTo || 'Unassigned'}</div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <Button variant="outline" className="w-full justify-center border-red-500/20 text-red-500 hover:bg-red-500/10 font-black text-xs uppercase tracking-widest">
                  Flag Security Incident
                </Button>
              </div>
            </section>
          </aside>
        </div>
      )}

      {/* Modal */}
      <AssetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAsset}
        initialData={selectedAsset}
        isDark={isDark}
      />
    </Layout>
  );
};

export default AssetManagement;