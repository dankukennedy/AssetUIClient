import React, { useState, useMemo } from "react";
import { Layout } from "../component/Layout";
import {
  Recycle,
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  FileCheck,
  CheckCircle2,
  SquareArrowOutUpLeft,
  ShieldAlert,
  Download,
  AlertOctagon,
  Loader2,
  Filter,
  Building2,
  Calendar,
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";
import { DisposalModal } from "../models/DisposalsModal";

// --- Types ---
export interface DisposalRecord {
  id: string;
  assetId: string;
  method: string;
  company: string;
  date?: string;
}

const Disposal = () => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("All Methods");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DisposalRecord | null>(
    null
  );
  const [viewingRecord, setViewingRecord] = useState<DisposalRecord | null>(
    null
  );

  // Custom Purge States
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", sub: "" });

  const itemsPerPage = 6;

  const [items, setItems] = useState<DisposalRecord[]>([
    {
      id: "DISP-552",
      assetId: "AST-102",
      method: "Eco-Recycle",
      company: "GreenTech Solutions",
      date: "2024-06-15",
    },
    {
      id: "DISP-889",
      assetId: "AST-404",
      method: "Physical Incineration",
      company: "SecureShred Corp",
      date: "2024-07-02",
    },
  ]);

  // Derived unique methods for filter
  const methodOptions = useMemo(() => {
    const methods = new Set(items.map((i) => i.method));
    return ["All Methods", ...Array.from(methods)];
  }, [items]);

  // --- Logic: Trigger Toast ---
  const triggerToast = (title: string, sub: string) => {
    setToastMessage({ title, sub });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // --- Handlers ---
  const handleSave = (data: DisposalRecord) => {
    if (selectedRecord) {
      setItems(items.map((i) => (i.id === selectedRecord.id ? data : i)));
      triggerToast("Manifest Updated", "Disposal parameters reconfigured");
    } else {
      setItems([data, ...items]);
      triggerToast("Disposal Logged", "Physical destruction record indexed");
    }
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setItems(items.filter((i) => i.id !== deleteId));
    triggerToast("Record Purged", `Manifest ${deleteId} removed from registry`);

    setDeleteId(null);
    setIsDeleting(false);
    if (viewingRecord?.id === deleteId) setViewingRecord(null);
  };

  const downloadCSV = () => {
    const headers = ["Disposal ID", "Asset ID", "Method", "Company", "Date"];
    const csvContent = [
      headers.join(","),
      ...items.map((i) =>
        [i.id, i.assetId, i.method, `"${i.company}"`, i.date || "N/A"].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `disposal_manifest_${new Date().getTime()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Export Success", "Manifest downloaded as CSV");
  };

  // --- Logic: Search & Pagination ---
  const filteredItems = useMemo(() => {
    return items.filter((i) => {
      const matchesSearch =
        i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.company.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMethod =
        methodFilter === "All Methods" || i.method === methodFilter;

      return matchesSearch && matchesMethod;
    });
  }, [searchTerm, methodFilter, items]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginated = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout title="Sanitization & Disposal" icon={Recycle}>
      {/* 1. PURGE CONFIRMATION MODAL */}
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
              Purge Record?
            </h3>
            <p className="text-[10px] text-gray-500 mb-8 font-mono tracking-widest uppercase">
              Permanently removing manifest: {deleteId}
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
            Disposal Manifest
          </h2>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            End-of-life hardware sanitization and recycling logs
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="flex-1 sm:flex-none h-12 rounded-xl border-slate-700/50 hover:bg-slate-500/10 font-black text-[10px] uppercase tracking-widest"
          >
            <Download size={16} className="mr-2" /> Export Logs
          </Button>
          <Button
            onClick={() => {
              setSelectedRecord(null);
              setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-none h-12 rounded-xl font-black text-[10px] uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
          >
            <Plus size={16} className="mr-2" /> Log Disposal
          </Button>
        </div>
      </div>

      {/* 4. SEARCH & FILTER */}
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
            placeholder="Search by manifest ID, Asset ID or Vendor..."
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
            value={methodFilter}
            onChange={(e) => {
              setMethodFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={cn(
              "w-full pl-10 pr-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer",
              isDark
                ? "bg-black/20 border-white/10 text-white"
                : "bg-gray-50 border-gray-200 text-gray-700"
            )}
          >
            {methodOptions.map((opt) => (
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

      {/* 5. CONTENT AREA */}
      <div
        className={cn(
          "rounded-[2rem] border overflow-hidden",
          isDark
            ? "border-white/5 bg-[#111118]"
            : "bg-white shadow-sm border-gray-100"
        )}
      >
        {/* DESKTOP TABLE */}
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
                <th className="px-8 py-5">Manifest ID</th>
                <th className="px-8 py-5">Asset Reference</th>
                <th className="px-8 py-5">Method</th>
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
                paginated.map((record) => (
                  <tr
                    key={record.id}
                    className={cn(
                      "text-sm transition-colors group",
                      isDark
                        ? "hover:bg-white/[0.02]"
                        : "hover:bg-emerald-50/30"
                    )}
                  >
                    <td className="px-8 py-5 font-mono text-[11px] text-emerald-500 font-black tracking-tighter uppercase">
                      {record.id}
                    </td>
                    <td className="px-8 py-5 font-black tracking-tight">
                      {record.assetId}
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500">
                        {record.method}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-emerald-500"
                          onClick={() => setViewingRecord(record)}
                        >
                          <SquareArrowOutUpLeft size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-emerald-500"
                          onClick={() => {
                            setSelectedRecord(record);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-red-500"
                          onClick={() => setDeleteId(record.id)}
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
                    No disposal records matching criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden divide-y divide-white/5">
          {paginated.map((record) => (
            <div key={record.id} className="p-6 flex flex-col gap-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-[10px] text-emerald-500 font-black uppercase mb-1">
                    {record.id}
                  </p>
                  <h4
                    className={cn(
                      "font-black text-lg",
                      isDark ? "text-white" : "text-gray-900"
                    )}
                  >
                    {record.assetId}
                  </h4>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                    {record.method}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-11 border-white/10 text-[9px] uppercase font-black tracking-widest"
                  onClick={() => setViewingRecord(record)}
                >
                  Details
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-11 border-white/10 text-[9px] uppercase font-black tracking-widest"
                  onClick={() => {
                    setSelectedRecord(record);
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 text-red-500/50 hover:text-red-500"
                  onClick={() => setDeleteId(record.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
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
            PURGED UNITS: {filteredItems.length}
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
      {viewingRecord && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in"
            onClick={() => setViewingRecord(null)}
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
              onClick={() => setViewingRecord(null)}
              className="absolute top-8 right-8 text-slate-500 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
            <header className="mb-12 pt-6">
              <span className="px-4 py-1.5 rounded-full text-[9px] font-black border border-emerald-500/50 text-emerald-500 mb-6 inline-block uppercase tracking-[0.2em]">
                Destruction Certificate
              </span>
              <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tighter uppercase">
                Manifest Details
              </h2>
              <p className="font-mono text-emerald-500 text-sm font-black tracking-[0.1em] uppercase">
                {viewingRecord.id}
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
                <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                  <FileCheck size={16} /> Data Sanitization Log
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 text-sm">
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      Target Asset
                    </p>
                    <p className="font-black text-lg">
                      {viewingRecord.assetId}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      Sanitization Method
                    </p>
                    <p className="font-black text-lg text-emerald-500">
                      {viewingRecord.method}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      Disposal Vendor
                    </p>
                    <p className="font-black tracking-tight flex items-center gap-2">
                      <Building2 size={14} className="text-gray-400" />{" "}
                      {viewingRecord.company}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      Finalization Date
                    </p>
                    <p className="font-mono font-black flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />{" "}
                      {viewingRecord.date || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                <Button className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 font-black text-[10px] uppercase tracking-[0.2em] h-14 rounded-2xl shadow-xl">
                  <ShieldAlert size={18} className="mr-3" /> View Compliance
                  Certificate
                </Button>
              </div>
            </section>
          </aside>
        </div>
      )}

      <DisposalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedRecord}
        isDark={isDark}
      />
    </Layout>
  );
};

export default Disposal;
