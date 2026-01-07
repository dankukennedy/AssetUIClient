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
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
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
                "w-full px-5 py-3 rounded-2xl border outline-none appearance-none transition-all",
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
      triggerToast("Sector Updated", "Infrastructure parameters synchronized");
    } else {
      setDepartments([data, ...departments]);
      triggerToast("Sector Authorized", "New department integrated into grid");
    }
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setDepartments(departments.filter((d) => d.departmentId !== deleteId));
    triggerToast(
      "Sector Purged",
      `Department ${deleteId} removed from registry`
    );

    setDeleteId(null);
    setIsDeleting(false);
    if (viewingDept?.departmentId === deleteId) setViewingDept(null);
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
    <Layout title="Department Matrix" icon={Building2}>
      {/* 1. DELETE MODAL */}
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
              Decommissioning: {deleteId}
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

      {/* 2. TOAST NOTIFICATION */}
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

      {/* 3. HEADER */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
        <div>
          <h2
            className={cn(
              "text-2xl font-black tracking-tight uppercase",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            Sector Registry
          </h2>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            Managing corporate infrastructure and block assignments
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none h-12 rounded-xl border-slate-700/50 font-black text-[10px] uppercase tracking-widest"
          >
            <Download size={16} className="mr-2" /> Export Grid
          </Button>
          <Button
            onClick={() => {
              setSelectedDept(null);
              setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-none h-12 rounded-xl font-black text-[10px] uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
          >
            <Plus size={16} className="mr-2" /> New Department
          </Button>
        </div>
      </div>

      {/* 4. SEARCH & FILTERS */}
      <div
        className={cn(
          "p-4 rounded-2xl mb-6 border shadow-sm flex flex-col lg:flex-row gap-4 items-center",
          isDark ? "bg-[#111118] border-white/5" : "bg-white border-gray-100"
        )}
      >
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            placeholder="Search by ID or Sector name..."
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

        <div className="relative w-full lg:w-64">
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
            {["All Blocks", ...BLOCKS].map((opt) => (
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

      {/* 5. RESPONSIVE LIST CONTENT */}
      <div
        className={cn(
          "rounded-[2rem] border overflow-hidden",
          isDark
            ? "border-white/5 bg-[#111118]"
            : "bg-white shadow-sm border-gray-100"
        )}
      >
        {/* DESKTOP VIEW */}
        <div className="hidden md:block overflow-x-auto">
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
                <th className="px-8 py-5">System UID</th>
                <th className="px-8 py-5">Sector Name</th>
                <th className="px-8 py-5">Allocation</th>
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
                paginated.map((dept) => (
                  <tr
                    key={dept.departmentId}
                    className={cn(
                      "text-sm transition-colors group",
                      isDark
                        ? "hover:bg-white/[0.02]"
                        : "hover:bg-emerald-50/30"
                    )}
                  >
                    <td className="px-8 py-5 font-mono text-[11px] text-emerald-500 font-black tracking-tighter uppercase">
                      {dept.departmentId}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "font-black uppercase",
                            isDark ? "text-gray-200" : "text-gray-900"
                          )}
                        >
                          {dept.name}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                          Lead: {dept.userId}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-500 uppercase tracking-widest">
                        {dept.blockId}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-emerald-500"
                          onClick={() => setViewingDept(dept)}
                        >
                          <SquareArrowOutUpLeft size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-emerald-500"
                          onClick={() => {
                            setSelectedDept(dept);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-red-500"
                          onClick={() => setDeleteId(dept.departmentId)}
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
                    No matching sector records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW */}
        <div className="md:hidden divide-y divide-white/5">
          {paginated.length > 0 ? (
            paginated.map((dept) => (
              <div key={dept.departmentId} className="p-6 flex flex-col gap-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono text-[10px] text-emerald-500 font-black tracking-tighter uppercase mb-1">
                      {dept.departmentId}
                    </p>
                    <h4
                      className={cn(
                        "font-black text-lg uppercase",
                        isDark ? "text-white" : "text-gray-900"
                      )}
                    >
                      {dept.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                      Admin: {dept.userId}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-500 uppercase tracking-widest">
                    {dept.blockId}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 h-11 border-white/10 text-[9px] uppercase font-black tracking-widest"
                    onClick={() => setViewingDept(dept)}
                  >
                    Matrix
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-11 border-white/10 text-[9px] uppercase font-black tracking-widest"
                    onClick={() => {
                      setSelectedDept(dept);
                      setIsModalOpen(true);
                    }}
                  >
                    Config
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 text-red-500/50 hover:text-red-500"
                    onClick={() => setDeleteId(dept.departmentId)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-xs font-mono text-gray-500 uppercase tracking-widest">
              No sector records online
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div
          className={cn(
            "px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t",
            isDark
              ? "border-white/5 bg-white/5"
              : "border-gray-100 bg-gray-50/30"
          )}
        >
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest italic">
            ACTIVE SECTORS: {filtered.length}
          </span>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl"
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
              className="h-9 w-9 rounded-xl"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* 6. DETAIL SIDE DRAWER */}
      {viewingDept && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in"
            onClick={() => setViewingDept(null)}
          />
          <aside
            className={cn(
              "relative w-full max-w-lg h-full p-8 md:p-12 shadow-2xl animate-in slide-in-from-right duration-300 border-l overflow-y-auto",
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
              <span className="px-4 py-1.5 rounded-full text-[9px] font-black border border-emerald-500/50 text-emerald-500 mb-6 inline-block uppercase tracking-[0.2em]">
                Sector Profile
              </span>
              <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tighter uppercase">
                {viewingDept.name}
              </h2>
              <p className="font-mono text-emerald-500 text-sm font-black uppercase">
                {viewingDept.departmentId}
              </p>
            </header>
            <section className="space-y-8">
              <div
                className={cn(
                  "rounded-3xl p-6 md:p-8 border shadow-inner",
                  isDark
                    ? "bg-white/5 border-white/5"
                    : "bg-gray-50 border-gray-100"
                )}
              >
                <h3 className="text-[10px] font-black text-emerald-400 uppercase mb-8 flex items-center gap-3">
                  <UsersIcon size={16} /> Hierarchy Data
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10">
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] mb-2">
                      Lead Administrator
                    </p>
                    <p className="font-black text-lg">{viewingDept.userId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] mb-2">
                      Block Allocation
                    </p>
                    <p className="font-black text-lg uppercase text-emerald-500">
                      {viewingDept.blockId}
                    </p>
                  </div>
                </div>
              </div>
              <Button className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 font-black text-[10px] uppercase h-14 rounded-2xl shadow-xl shadow-emerald-900/20">
                <ShieldCheck size={18} className="mr-3" /> Audit Sector Logs
              </Button>
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
