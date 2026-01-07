import React, { useState, useMemo } from "react";
import { Layout } from "../component/Layout";
import {
  Users as UsersIcon,
  Plus,
  Edit2,
  Trash2,
  SquareArrowOutUpLeft,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Activity,
  School2Icon,
  CheckCircle2,
  Download, // Added for CSV
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";

// --- Types ---
interface Block {
  name: string;
  blockId: string;
}

// --- Sub-Component: BlockModal ---
interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (block: Block) => void;
  initialData?: Block | null;
  isDark: boolean;
}

const BlockModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isDark,
}: BlockModalProps) => {
  const [formData, setFormData] = useState<Block>({ name: "", blockId: "" });

  React.useEffect(() => {
    if (initialData) setFormData(initialData);
    else
      setFormData({
        name: "",
        blockId: `BLK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={cn(
          "w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transition-all transform animate-in fade-in zoom-in duration-200",
          isDark
            ? "bg-[#111118] border border-white/10 text-white"
            : "bg-white text-gray-900"
        )}
      >
        <div
          className={cn(
            "px-6 py-4 border-b flex justify-between items-center",
            isDark ? "border-white/5" : "border-gray-100"
          )}
        >
          <h3 className="font-black text-xs uppercase tracking-widest">
            {initialData ? "Update Block" : "Initialize Block"}
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
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
              Block Identifier
            </label>
            <input
              readOnly
              className={cn(
                "w-full px-4 py-2 rounded-lg border outline-none opacity-50 font-mono text-xs",
                isDark
                  ? "bg-black/40 border-white/10 text-blue-400"
                  : "bg-gray-100 border-gray-200"
              )}
              value={formData.blockId}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
              Block Name / Status
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Active, Maintenance, Restricted"
              className={cn(
                "w-full px-4 py-2 rounded-lg border outline-none",
                isDark
                  ? "bg-black/20 border-white/10 text-white"
                  : "bg-gray-50 border-gray-200"
              )}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              className="text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              type="submit"
              className="text-xs font-black uppercase tracking-widest"
            >
              {initialData ? "Save Changes" : "Commit Block"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const BlocksPage = () => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [viewingBlock, setViewingBlock] = useState<Block | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", sub: "" });

  const itemsPerPage = 6;

  const [blocks, setBlocks] = useState<Block[]>([
    { name: "Active", blockId: "z0v5rr8r8r8733hy8j" },
    { name: "Maintenance", blockId: "a0v82c8r8r8777hy8t" },
    { name: "Restricted", blockId: "y0v5rr8r855548hy8y" },
    { name: "Active", blockId: "f0v5rr588r88h8hy8c" },
    { name: "Offline", blockId: "g0v5rr8r8r5558hy8w" },
  ]);

  // --- CSV Export Logic ---
  const downloadCSV = () => {
    // Generate headers and data rows
    const headers = ["Block ID", "Status/Name"];
    const csvContent = [
      headers.join(","),
      ...filteredBlocks.map((block) => `${block.blockId},${block.name}`),
    ].join("\n");

    // Create file and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `system_blocks_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Provide feedback
    setToastMessage({
      title: "Data Exported",
      sub: "CSV manifest downloaded successfully",
    });
    triggerToast();
  };

  const filteredBlocks = useMemo(() => {
    return blocks.filter(
      (block) =>
        block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        block.blockId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, blocks]);

  const totalPages = Math.ceil(filteredBlocks.length / itemsPerPage);
  const paginatedBlocks = filteredBlocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSaveBlock = (blockData: Block) => {
    if (selectedBlock) {
      setBlocks(
        blocks.map((b) => (b.blockId === selectedBlock.blockId ? blockData : b))
      );
      setToastMessage({
        title: "System Updated",
        sub: "Block parameters reconfigured",
      });
    } else {
      setBlocks([blockData, ...blocks]);
      setToastMessage({
        title: "Block Initialized",
        sub: "New system entity registered",
      });
    }
    setIsModalOpen(false);
    triggerToast();
  };

  const handleDeleteBlock = (id: string) => {
    if (
      window.confirm(
        "CRITICAL: Deleting this block may interrupt dependent system processes. Proceed?"
      )
    ) {
      setBlocks(blocks.filter((b) => b.blockId !== id));
      setToastMessage({
        title: "Block Purged",
        sub: "Entity removed from system index",
      });
      triggerToast();
    }
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <Layout title="System Control" icon={UsersIcon}>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[400] animate-in slide-in-from-bottom-5">
          <div
            className={cn(
              "flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border",
              isDark
                ? "bg-[#111118] border-blue-500/50 text-blue-400"
                : "bg-white border-blue-100 text-blue-600"
            )}
          >
            <CheckCircle2 size={20} />
            <div className="flex flex-col">
              <span className="text-sm font-black">{toastMessage.title}</span>
              <span className="text-[10px] opacity-70 uppercase tracking-widest">
                {toastMessage.sub}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2
            className={cn(
              "text-2xl font-black tracking-tight",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            System Blocks
          </h2>
          <p className="text-sm text-gray-500">
            Node management and status control
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          {/* Added Export Button */}
          <Button
            variant="outline"
            className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest py-5 px-6 border-slate-700/50 hover:bg-slate-500/10"
            onClick={downloadCSV}
          >
            <Download size={18} /> Export CSV
          </Button>
          <Button
            className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest py-5 px-6 shadow-lg shadow-blue-500/20"
            onClick={() => {
              setSelectedBlock(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={18} /> New Block
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className={cn(
          "p-4 rounded-xl mb-6",
          isDark
            ? "bg-[#111118] border border-white/5"
            : "bg-white border border-gray-100 shadow-sm"
        )}
      >
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            placeholder="Search records by ID or Name..."
            className={cn(
              "w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none",
              isDark
                ? "bg-black/20 border-white/10 text-white"
                : "bg-gray-50 border-gray-200"
            )}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div
        className={cn(
          "rounded-xl border overflow-hidden",
          isDark ? "border-white/5 bg-[#111118]" : "border-gray-100 bg-white"
        )}
      >
        <table className="w-full text-left">
          <thead
            className={cn(
              "text-[10px] uppercase font-black tracking-widest",
              isDark ? "bg-white/5 text-gray-400" : "bg-gray-50 text-gray-500"
            )}
          >
            <tr>
              <th className="px-6 py-4">Block Identity</th>
              <th className="px-6 py-4">Status / Label</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody
            className={cn(
              "divide-y",
              isDark ? "divide-white/5" : "divide-gray-50"
            )}
          >
            {paginatedBlocks.map((block) => (
              <tr
                key={block.blockId}
                className={cn(
                  "text-sm transition-colors",
                  isDark ? "hover:bg-white/5" : "hover:bg-blue-50/50"
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        "font-bold",
                        isDark ? "text-gray-200" : "text-gray-700"
                      )}
                    >
                      Node ID
                    </span>
                    <span className="text-[11px] text-blue-500 font-mono font-bold uppercase tracking-tighter">
                      {block.blockId}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      block.name.toLowerCase() === "active"
                        ? "bg-green-500/10 text-green-500"
                        : block.name.toLowerCase() === "maintenance"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-red-500/10 text-red-500"
                    )}
                  >
                    {block.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-yellow-500"
                      onClick={() => setViewingBlock(block)}
                    >
                      <SquareArrowOutUpLeft size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500"
                      onClick={() => {
                        setSelectedBlock(block);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={() => handleDeleteBlock(block.blockId)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div
          className={cn(
            "px-6 py-4 flex items-center justify-between border-t",
            isDark
              ? "border-white/5 bg-white/5"
              : "border-gray-100 bg-gray-50/30"
          )}
        >
          <span className="text-xs text-gray-500 font-mono">
            PTR: {filteredBlocks.length} RECORDS
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={14} />
            </Button>
            <span className="text-[10px] font-black w-12 text-center">
              {currentPage} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Side Drawer */}
      {viewingBlock && (
        <div className="fixed inset-0 z-100 flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setViewingBlock(null)}
          />
          <aside
            className={cn(
              "relative w-full max-w-lg h-full p-10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-300 overflow-y-auto border-l",
              isDark
                ? "bg-[#0d0d12] border-white/10 text-white"
                : "bg-white border-gray-200 text-gray-900"
            )}
          >
            <button
              onClick={() => setViewingBlock(null)}
              className="absolute top-6 right-6 text-slate-500 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
            <header className="mb-10">
              <span className="px-3 py-1 rounded-lg text-[10px] font-black border border-blue-500/50 text-blue-500 mb-4 inline-block tracking-widest">
                BLOCK SPECIFICATIONS
              </span>
              <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase">
                {viewingBlock.name}
              </h2>
              <div className="flex items-center gap-2 text-slate-400">
                <School2Icon size={14} />
                <span className="text-sm font-mono">
                  {viewingBlock.blockId}
                </span>
              </div>
            </header>

            <section className="space-y-8">
              <div
                className={cn(
                  "rounded-2xl p-6 border",
                  isDark
                    ? "bg-white/5 border-white/5"
                    : "bg-gray-50 border-gray-100"
                )}
              >
                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">
                  Core Metadata
                </h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm font-mono">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">
                    Registry Status
                  </div>
                  <div className="text-emerald-500 font-black tracking-widest">
                    VERIFIED
                  </div>
                  <div className="text-slate-500 font-bold uppercase text-[10px]">
                    Infrastructure
                  </div>
                  <div>Primary Cluster</div>
                  <div className="text-slate-500 font-bold uppercase text-[10px]">
                    Last Checksum
                  </div>
                  <div className="text-blue-500 font-bold uppercase">
                    {Math.random().toString(16).slice(2, 8)}
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "rounded-2xl p-6 border",
                  isDark
                    ? "bg-white/5 border-white/5"
                    : "bg-gray-50 border-gray-100"
                )}
              >
                <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity size={12} /> Live Telemetry
                </h3>
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500 italic">Availability</span>
                    <span className="text-emerald-500">99.9%</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500 italic">Runtime ID</span>
                    <span>
                      {viewingBlock.blockId.split("-")[1] ||
                        viewingBlock.blockId}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full justify-center border-red-500/20 text-red-500 hover:bg-red-500/10 font-black uppercase text-[10px] tracking-widest py-6"
              >
                Deactivate System Node
              </Button>
            </section>
          </aside>
        </div>
      )}

      {/* Modals */}
      <BlockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBlock}
        initialData={selectedBlock}
        isDark={isDark}
      />
    </Layout>
  );
};

export default BlocksPage;
