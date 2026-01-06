import React, { useState, useMemo } from 'react';
import { Layout } from '../component/Layout';
import { 
  Users as UsersIcon, Plus, Edit2, Trash2, 
  SquareArrowOutUpLeft, Search, Filter, 
  ChevronLeft, ChevronRight, X, Mail, Shield, Activity
} from 'lucide-react';
import { useTheme } from '../component/theme-provider';
import { cn } from '../lib/utils';
import { Button } from "../component/ui/button";

// --- Types ---
interface Block {
  name: string;
 blockId: string;
}

// --- Sub-Component: UserModal (Create/Edit) ---
interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Block) => void;
  initialData?: Block | null;
  isDark: boolean;
}

const UserModal = ({ isOpen, onClose, onSave, initialData, isDark }: BlockModalProps) => {
  const [formData, setFormData] = useState<Block>({
    name: '',blockId: ''
  });

  React.useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({  name: '', blockId: ''});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={cn(
        "w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transition-all transform animate-in fade-in zoom-in duration-200",
        isDark ? "bg-[#111118] border border-white/10 text-white" : "bg-white text-gray-900"
      )}>
        <div className={cn("px-6 py-4 border-b flex justify-between items-center", isDark ? "border-white/5" : "border-gray-100")}>
          <h3 className="font-bold text-lg">{initialData ? 'Edit Block' : 'Create New Block'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
        </div>
        <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Block Name</label>
            <input required type="text" className={cn("w-full px-4 py-2 rounded-lg border outline-none", isDark ? "bg-black/20 border-white/10 text-white" : "bg-gray-50 border-gray-200")} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="default" type="submit">{initialData ? 'Update Block' : 'Create Block'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const BlocksPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [searchTerm, setSearchTerm] = useState("");
  const [nameFilter , setNameFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [viewingBlock, setViewingBlock] = useState<Block | null>(null); // State for the side drawer
  
  const itemsPerPage = 6;

  const [blocks, setBlocks] = useState<Block[]>([
    { name: "A", blockId: "c0v5rr8r8r88h8hy8j", },
    { name: "B", blockId: "c0v5rr8r8r88h8hy8j", },
    { name: "C", blockId: "c0v5rr8r8r88h8hy8j", },
    { name: "D", blockId: "c0v5rr8r8r88h8hy8j", },
    { name: "E", blockId: "c0v5rr8r8r88h8hy8j", },
  ]);

  const filteredBlocks = useMemo(() => {
    return blocks.filter(block => {
      const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            block.blockId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesName = nameFilter === "All" || block.name === nameFilter;
      return matchesSearch && matchesName;
    });
  }, [searchTerm, nameFilter, blocks]);

  const totalPages = Math.ceil(filteredBlocks.length / itemsPerPage);
  const paginatedBlocks = filteredBlocks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSaveBlock = (blockData: Block) => {
    if (selectedBlock) setBlocks(blocks.map(u => u.name === selectedBlock.name ? blockData : u));
    else setBlocks([blockData, ...blocks]);
    setIsModalOpen(false);
  };

  return (
    <Layout title="User Management" icon={UsersIcon}>
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className={cn("text-2xl font-black tracking-tight", isDark ? "text-white" : "text-gray-900")}>System Blocks</h2>
          <p className="text-sm text-gray-500">Manage Blocks control</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => { setSelectedBlock(null); setIsModalOpen(true); }}>
          <Plus size={18} /> New Block
        </Button>
      </div>

      {/* Filter Bar */}
      <div className={cn("p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 items-center justify-between", isDark ? "bg-[#111118] border border-white/5" : "bg-white border border-gray-100 shadow-sm")}>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input placeholder="Search records..." className={cn("w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none", isDark ? "bg-black/20 border-white/10 text-white" : "bg-gray-50 border-gray-200")} value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        </div>
        <select className={cn("px-3 py-2 rounded-lg text-sm outline-none w-full md:w-48", isDark ? "bg-black/20 border-white/10 text-white" : "bg-gray-50 border-gray-200")} value={nameFilter} onChange={(e) => { setNameFilter(e.target.value); setCurrentPage(1); }}>
          <option value="All">All Blocks</option>
          <option value="Name">Name</option>
          <option value="BlockId">Block ID</option>
        </select>
      </div>

      {/* Table */}
      <div className={cn("rounded-xl border overflow-hidden", isDark ? "border-white/5 bg-[#111118]" : "border-gray-100 bg-white")}>
        <table className="w-full text-left">
          <thead className={cn("text-[10px] uppercase font-black tracking-widest", isDark ? "bg-white/5 text-gray-400" : "bg-gray-50 text-gray-500")}>
            <tr>
              <th className="px-6 py-4">Identity</th>
              <th className="px-6 py-4">Blocks</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={cn("divide-y", isDark ? "divide-white/5" : "divide-gray-50")}>
            {paginatedBlocks.map((block, i) => (
              <tr key={i} className={cn("text-sm transition-colors", isDark ? "hover:bg-white/5" : "hover:bg-blue-50/50")}>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className={cn("font-bold", isDark ? "text-gray-200" : "text-gray-700")}>Block ID</span>
                    <span className="text-[11px] text-gray-500 font-mono">{block.blockId}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black", block.name === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500')}>
                    {block.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-yellow-500" onClick={() => setViewingBlock(block)}><SquareArrowOutUpLeft size={14}/></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" onClick={() => { setSelectedBlock(block); setIsModalOpen(true); }}><Edit2 size={14}/></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><Trash2 size={14}/></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className={cn("px-6 py-4 flex items-center justify-between border-t", isDark ? "border-white/5 bg-white/5" : "border-gray-100 bg-gray-50/30")}>
          <span className="text-xs text-gray-500 font-mono">PTR: {filteredBlocks.length} RECORDS</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft size={14} /></Button>
            <span className="text-[10px] font-black w-12 text-center">{currentPage} / {totalPages || 1}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight size={14} /></Button>
          </div>
        </div>
      </div>

      {/* --- SIDE DETAILS DRAWER --- */}
      {viewingBlock && (
        <div className="fixed inset-0 z-100 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setViewingBlock(null)} />
          
          <aside className={cn(
            "relative w-full max-w-lg h-full p-10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] animate-slide-in-right overflow-y-auto border-l",
            isDark ? "bg-[#0d0d12] border-white/10 text-white" : "bg-white border-gray-200 text-gray-900"
          )}>
            <button onClick={() => setViewingBlock(null)} className="absolute top-6 right-6 text-slate-500 hover:text-red-500 transition-colors">
              <X size={24} />
            </button>
            
            <header className="mb-10">
              <h2 className="text-4xl font-black mb-2 tracking-tighter">{viewingBlock.name}</h2>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail size={14} />
                <span className="text-sm font-mono">{viewingBlock.name}Name</span>
              </div>
            </header>

            <section className="space-y-8">
              <div className={cn("rounded-2xl p-6 border", isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100")}>
                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Security Profile</h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Access Level</div>
                  <div className="font-mono">{viewingBlock.name}</div>
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Department</div>
                  <div className="font-mono">IT Infrastructure</div>
                  <div className="text-slate-500 font-bold uppercase text-[10px]">Employee ID</div>
                  <div className="font-mono text-blue-500">USR-{Math.floor(Math.random()*10000)}</div>
                </div>
              </div>

              <div className={cn("rounded-2xl p-6 border", isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100")}>
                <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity size={12} /> Activity Logs
                </h3>
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500 italic">Last Session</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500 italic">Block Created</span>
                    {/* <span>{viewingBlock.joinedDate}</span> */}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button variant="outline" className="w-full justify-center border-red-500/20 text-red-500 hover:bg-red-500/10">
                  Revoke All Sessions
                </Button>
              </div>
            </section>
          </aside>
        </div>
      )}

      {/* Modals */}
      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveBlock} initialData={selectedBlock} isDark={isDark} />
    </Layout>
  );
};

export default BlocksPage;