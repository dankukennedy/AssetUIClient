import React, { useState, useMemo, useEffect } from "react";
import { Layout } from "../component/Layout";
import {
  Users as UsersIcon,
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Building2,
  CheckCircle2,
  SquareArrowOutUpLeft,
  ShieldCheck,
  Download,
  AlertOctagon,
  Loader2,
  Terminal,
  Filter,
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";

// --- Types ---
interface Department {
  userId: string;
  name: string;
  blockId: string;
  departmentId: string;
}

// --- Sub-Component: DepartmentModal ---
interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dept: Department) => void;
  initialData?: Department | null;
  isDark: boolean;
}

const BLOCKS = ["BLOCK-A", "BLOCK-B", "BLOCK-C", "BLOCK-D", "BLOCK-S"];

const DepartmentModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isDark,
}: DepartmentModalProps) => {
  const [formData, setFormData] = useState<Department>({
    userId: "",
    name: "",
    blockId: "BLOCK-A",
    departmentId: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (isOpen) {
      const timestamp = Date.now().toString(36).slice(-3).toUpperCase();
      const randomStr = Math.random()
        .toString(36)
        .substring(2, 5)
        .toUpperCase();
      setFormData({
        departmentId: `DEPT-${timestamp}${randomStr}`,
        userId: `USR-${Math.floor(Math.random() * 1000)}`,
        name: "",
        blockId: "BLOCK-A",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div
        className={cn(
          "w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border animate-in zoom-in-95",
          isDark
            ? "bg-[#0d0d12] border-white/10 text-white"
            : "bg-white border-gray-200 text-gray-900"
        )}
      >
        <div
          className={cn(
            "px-8 py-6 border-b flex justify-between items-center",
            isDark ? "border-white/5" : "border-gray-100"
          )}
        >
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-emerald-500" />
            <h3 className="font-black text-[10px] uppercase tracking-[0.2em]">
              {initialData ? "Reconfigure Sector" : "Initialize New Department"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form
          className="p-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
        >
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">
              Department UID
            </label>
            <input
              readOnly
              className={cn(
                "w-full px-5 py-3 rounded-2xl border font-mono text-xs cursor-not-allowed",
                isDark
                  ? "bg-black/40 border-white/5 text-emerald-400/70"
                  : "bg-gray-100 border-gray-200"
              )}
              value={formData.departmentId}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">
              Sector Name
            </label>
            <input
              required
              type="text"
              autoFocus
              className={cn(
                "w-full px-5 py-3 rounded-2xl border outline-none focus:ring-2 ring-emerald-500/20 transition-all",
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
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">
              Block Allocation
            </label>
            <select
              className={cn(
                "w-full px-5 py-3 rounded-2xl border outline-none focus:ring-2 ring-emerald-500/20 appearance-none transition-all",
                isDark
                  ? "bg-black/20 border-white/10 text-white"
                  : "bg-gray-50 border-gray-200"
              )}
              value={formData.blockId}
              onChange={(e) =>
                setFormData({ ...formData, blockId: e.target.value })
              }
            >
              {BLOCKS.map((block) => (
                <option
                  key={block}
                  value={block}
                  className={isDark ? "bg-[#0d0d12]" : "bg-white"}
                >
                  {block}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              className="text-[10px] font-black uppercase tracking-widest rounded-xl"
            >
              Abort
            </Button>
            <Button
              variant="default"
              type="submit"
              className="text-[10px] font-black uppercase tracking-[0.15em] rounded-xl px-8 shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {initialData ? "Sync Registry" : "Authorize Sector"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const DepartmentsPage = () => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [searchTerm, setSearchTerm] = useState("");
  const [blockFilter, setBlockFilter] = useState("All Blocks");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [viewingDept, setViewingDept] = useState<Department | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", sub: "" });

  const itemsPerPage = 6;
  const [departments, setDepartments] = useState<Department[]>([
    {
      userId: "USR-99",
      name: "Cyber Security",
      departmentId: "DEPT-V5R8",
      blockId: "BLOCK-D",
    },
    {
      userId: "USR-88",
      name: "Central Management",
      departmentId: "DEPT-K9P2",
      blockId: "BLOCK-A",
    },
    {
      userId: "USR-77",
      name: "Resource Logistics",
      departmentId: "DEPT-L4Q1",
      blockId: "BLOCK-C",
    },
  ]);

  // Derived block options for filter
  const blockOptions = useMemo(() => {
    const blocks = new Set(departments.map((d) => d.blockId));
    return ["All Blocks", ...Array.from(blocks)];
  }, [departments]);

  const triggerToast = (title: string, sub: string) => {
    setToastMessage({ title, sub });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = (data: Department) => {
    if (selectedDept) {
      setDepartments(
        departments.map((d) =>
          d.departmentId === selectedDept.departmentId ? data : d
        )
      );
      triggerToast("Registry Updated", "Sector configuration synchronized");
    } else {
      setDepartments([data, ...departments]);
      triggerToast("Sector Initialized", "New department committed to core");
    }
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setDepartments(departments.filter((d) => d.departmentId !== deleteId));
    triggerToast("Record Purged", `Sector ${deleteId} removed from registry`);
    setDeleteId(null);
    setIsDeleting(false);
    if (viewingDept?.departmentId === deleteId) setViewingDept(null);
  };

  const downloadCSV = () => {
    const headers = [
      "Sector Name",
      "Department ID",
      "Block Location",
      "Auth User",
    ];
    const csvContent = [
      headers.join(","),
      ...departments.map((d) =>
        [`"${d.name}"`, d.departmentId, d.blockId, d.userId].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `sector_registry_${new Date().getTime()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Export Successful", "Registry database saved to CSV");
  };

  const filtered = useMemo(() => {
    return departments.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.departmentId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBlock =
        blockFilter === "All Blocks" || d.blockId === blockFilter;

      return matchesSearch && matchesBlock;
    });
  }, [searchTerm, blockFilter, departments]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout title="Sector Registry" icon={UsersIcon}>
      {/* PURGE MODAL & TOAST REMAIN THE SAME... */}
      {deleteId && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className={cn(
              "p-8 rounded-[2.5rem] border max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95",
              isDark
                ? "bg-[#0d0d12] border-white/10"
                : "bg-white border-gray-200"
            )}
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertOctagon className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-black mb-2 tracking-tighter uppercase text-red-500">
              Purge Sector?
            </h3>
            <p className="text-[10px] text-gray-500 mb-8 font-mono tracking-widest uppercase">
              Permanently deauthorizing: {deleteId}
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                disabled={isDeleting}
                onClick={() => setDeleteId(null)}
              >
                Abort
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-10 right-10 z-[400] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={cn(
              "flex items-center gap-4 px-8 py-5 rounded-[2rem] shadow-2xl border",
              isDark
                ? "bg-[#111118] border-emerald-500/50 text-emerald-400"
                : "bg-white border-emerald-100 text-emerald-600"
            )}
          >
            <CheckCircle2 size={20} />
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-tight">
                {toastMessage.title}
              </span>
              <span className="text-[10px] opacity-70 uppercase font-bold tracking-[0.2em]">
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
              "text-2xl font-black tracking-tight uppercase",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            Sector Control
          </h2>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            Managing department access and hierarchy
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="h-12 rounded-xl border-slate-700/50 hover:bg-slate-500/10 font-black text-[10px] uppercase tracking-widest"
          >
            <Download size={16} className="mr-2" /> Export CSV
          </Button>
          <Button
            onClick={() => {
              setSelectedDept(null);
              setIsModalOpen(true);
            }}
            className="h-12 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus size={16} className="mr-2" /> New Sector
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div
        className={cn(
          "p-4 rounded-2xl mb-6 border shadow-sm flex flex-col md:flex-row gap-4 items-center",
          isDark ? "bg-[#111118] border-white/5" : "bg-white border-gray-100"
        )}
      >
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            placeholder="Search by sector name or ID..."
            className={cn(
              "w-full pl-12 pr-4 py-3 rounded-xl text-sm outline-none transition-all",
              isDark
                ? "bg-black/20 border-white/10 text-white focus:border-emerald-500/50"
                : "bg-gray-50 border-gray-200"
            )}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="relative w-full md:w-64">
          <Filter
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <select
            value={blockFilter}
            onChange={(e) => {
              setBlockFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={cn(
              "w-full pl-10 pr-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer",
              isDark
                ? "bg-black/20 border-white/10 text-white focus:border-emerald-500/50"
                : "bg-gray-50 border-gray-200 text-gray-700"
            )}
          >
            {blockOptions.map((opt) => (
              <option
                key={opt}
                value={opt}
                className={isDark ? "bg-[#0d0d12]" : "bg-white"}
              >
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table & Side Drawer Logic (Same as before) */}
      <div
        className={cn(
          "rounded-[2rem] border overflow-hidden",
          isDark
            ? "border-white/5 bg-[#111118]"
            : "bg-white shadow-sm border-gray-100"
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr
                className={cn(
                  "text-[10px] uppercase tracking-[0.2em] font-black",
                  isDark
                    ? "bg-white/5 text-gray-500"
                    : "bg-gray-50 text-gray-400"
                )}
              >
                <th className="px-8 py-5">Identity UID</th>
                <th className="px-8 py-5">Sector Name</th>
                <th className="px-8 py-5">Block Location</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className={cn(
                "divide-y",
                isDark ? "divide-white/5" : "divide-gray-50"
              )}
            >
              {paginated.length > 0 ? (
                paginated.map((d) => (
                  <tr
                    key={d.departmentId}
                    className={cn(
                      "text-sm transition-colors group",
                      isDark ? "hover:bg-white/[0.02]" : "hover:bg-blue-50/30"
                    )}
                  >
                    <td className="px-8 py-5 font-mono text-[11px] text-emerald-500 font-black tracking-tighter uppercase">
                      {d.departmentId}
                    </td>
                    <td
                      className={cn(
                        "px-8 py-5 font-black uppercase tracking-tight",
                        isDark ? "text-gray-200" : "text-gray-900"
                      )}
                    >
                      {d.name}
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        {d.blockId}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-emerald-500"
                          onClick={() => setViewingDept(d)}
                        >
                          <SquareArrowOutUpLeft size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-emerald-500"
                          onClick={() => {
                            setSelectedDept(d);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-red-500"
                          onClick={() => setDeleteId(d.departmentId)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-8 py-20 text-center text-xs font-mono text-gray-500 uppercase tracking-widest"
                  >
                    No matching sectors in registry
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          className={cn(
            "px-8 py-5 flex items-center justify-between border-t",
            isDark
              ? "border-white/5 bg-white/5"
              : "border-gray-100 bg-gray-50/30"
          )}
        >
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest italic">
            REGISTERED SECTORS: {filtered.length}
          </span>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={14} />
            </Button>
            <span className="text-[11px] font-black font-mono">
              {currentPage} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Side Drawer and Modal components stay the same as previous response */}
      {viewingDept && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in"
            onClick={() => setViewingDept(null)}
          />
          <aside
            className={cn(
              "relative w-full max-w-lg h-full p-12 shadow-2xl animate-in slide-in-from-right duration-300 border-l overflow-y-auto",
              isDark
                ? "bg-[#0d0d12] border-white/10 text-white"
                : "bg-white border-gray-200 text-gray-900"
            )}
          >
            <button
              onClick={() => setViewingDept(null)}
              className="absolute top-8 right-8 text-slate-500 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
            <header className="mb-12 pt-6">
              <span className="px-4 py-1.5 rounded-full text-[9px] font-black border border-emerald-500/50 text-emerald-400 mb-6 inline-block uppercase tracking-[0.2em]">
                Sector Profile
              </span>
              <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase">
                {viewingDept.name}
              </h2>
              <p className="font-mono text-emerald-500 text-sm font-black tracking-[0.1em] uppercase opacity-80">
                {viewingDept.departmentId}
              </p>
            </header>
            <section className="space-y-8">
              <div
                className={cn(
                  "rounded-3xl p-8 border shadow-inner",
                  isDark
                    ? "bg-white/5 border-white/5"
                    : "bg-gray-50 border-gray-100"
                )}
              >
                <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                  <Building2 size={16} /> Technical Details
                </h3>
                <div className="grid grid-cols-2 gap-y-10 text-sm">
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      Location Block
                    </p>
                    <p className="font-black text-lg">{viewingDept.blockId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      Management Signature
                    </p>
                    <p className="font-black tracking-tight">
                      {viewingDept.userId}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-white/5 space-y-4">
                <Button className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 font-black text-[10px] uppercase tracking-[0.2em] h-14 rounded-2xl shadow-xl shadow-emerald-900/20 text-white">
                  <ShieldCheck size={18} className="mr-3" /> Audit Compliance
                  Log
                </Button>
              </div>
            </section>
          </aside>
        </div>
      )}

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedDept}
        isDark={isDark}
      />
    </Layout>
  );
};

export default DepartmentsPage;
