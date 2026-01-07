import React, { useState, useMemo } from "react";
import { Layout } from "../component/Layout";
import {
  Recycle,
  Plus,
  FileCheck,
  Download,
  Trash2,
  Edit2,
  X,
  ShieldAlert,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertOctagon,
  Loader2,
  CheckCircle2,
  Building2,
  Filter, // 1. Added Filter icon
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";
import { DisposalModal } from "../models/DisposalsModal";

// --- Types ---
interface DisposalRecord {
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
  const [selectedMethod, setSelectedMethod] = useState("All Methods"); // 2. Filter State
  const [currentPage, setCurrentPage] = useState(1);
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

  // 3. Derived unique methods for the filter
  const methods = useMemo(() => {
    const uniqueMethods = new Set(items.map((i) => i.method));
    return ["All Methods", ...Array.from(uniqueMethods)];
  }, [items]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DisposalRecord | null>(
    null
  );
  const [viewingRecord, setViewingRecord] = useState<DisposalRecord | null>(
    null
  );
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", sub: "" });

  // --- Handlers ---
  const triggerToast = (title: string, sub: string) => {
    setToastMessage({ title, sub });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = (recordData: DisposalRecord) => {
    if (selectedRecord) {
      setItems(items.map((i) => (i.id === selectedRecord.id ? recordData : i)));
      triggerToast("Manifest Updated", "Disposal parameters reconfigured");
    } else {
      setItems([recordData, ...items]);
      triggerToast("Disposal Logged", "Physical destruction record indexed");
    }
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const confirmRevocation = async () => {
    if (!revokingId) return;
    setIsRevoking(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setItems(items.filter((item) => item.id !== revokingId));
    triggerToast("Record Purged", "Disposal entry removed from registry");
    setRevokingId(null);
    setIsRevoking(false);
    if (viewingRecord?.id === revokingId) setViewingRecord(null);
  };

  const downloadCSV = () => {
    const headers = ["Disposal ID", "Asset ID", "Method", "Company", "Date"];
    const csvContent = [
      headers.join(","),
      ...items.map((i) =>
        [i.id, i.assetId, i.method, i.company, i.date || "N/A"].join(",")
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

  // 4. Updated Logic: Search + Filter + Pagination
  const filteredItems = useMemo(() => {
    return items.filter((i) => {
      const matchesSearch =
        i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.company.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMethod =
        selectedMethod === "All Methods" || i.method === selectedMethod;

      return matchesSearch && matchesMethod;
    });
  }, [searchTerm, selectedMethod, items]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginated = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout title="Sanitization & Disposal" icon={Recycle}>
      {/* 1. REVOCATION MODAL (Existing) */}
      {revokingId && (
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
              Removing Manifest: {revokingId}
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                disabled={isRevoking}
                onClick={() => setRevokingId(null)}
              >
                Abort
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
                onClick={confirmRevocation}
                disabled={isRevoking}
              >
                {isRevoking ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Confirm"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. TOAST (Existing) */}
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
            Disposal Registry
          </h2>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            Asset physical destruction & e-waste manifests
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
              setSelectedRecord(null);
              setIsModalOpen(true);
            }}
            className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20"
          >
            <Plus size={16} className="mr-2" /> Log Disposal
          </Button>
        </div>
      </div>

      {/* 5. UPDATED Search & Filter Bar */}
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
            placeholder="Search manifest, asset or entity..."
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

        {/* Method Filter Dropdown */}
        <div className="relative w-full md:w-64">
          <Filter
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <select
            value={selectedMethod}
            onChange={(e) => {
              setSelectedMethod(e.target.value);
              setCurrentPage(1);
            }}
            className={cn(
              "w-full pl-10 pr-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer",
              isDark
                ? "bg-black/20 border-white/10 text-white focus:border-emerald-500/50"
                : "bg-gray-50 border-gray-200 text-gray-700"
            )}
          >
            {methods.map((method) => (
              <option
                key={method}
                value={method}
                className={isDark ? "bg-[#0d0d12]" : "bg-white"}
              >
                {method}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table (Uses paginated which now includes the method filter) */}
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
                <th className="px-8 py-5">Disposal Identity</th>
                <th className="px-8 py-5">Method & Entity</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className={cn(
                "divide-y",
                isDark ? "divide-white/5" : "divide-gray-50"
              )}
            >
              {paginated.map((i) => (
                <tr
                  key={i.id}
                  className={cn(
                    "text-sm transition-colors group",
                    isDark ? "hover:bg-white/[0.02]" : "hover:bg-emerald-50/30"
                  )}
                >
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "font-black",
                          isDark ? "text-gray-200" : "text-gray-900"
                        )}
                      >
                        {i.id}
                      </span>
                      <span className="font-mono text-[10px] text-emerald-500 font-black tracking-tighter uppercase">
                        Asset: {i.assetId}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black uppercase tracking-widest text-blue-500">
                        {i.method}
                      </span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase">
                        {i.company}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-gray-400 hover:text-emerald-500"
                        onClick={() => setViewingRecord(i)}
                      >
                        <FileCheck size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-gray-400 hover:text-blue-500"
                        onClick={() => {
                          setSelectedRecord(i);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-gray-400 hover:text-red-500"
                        onClick={() => setRevokingId(i.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination (Existing) */}
        <div
          className={cn(
            "px-8 py-5 flex items-center justify-between border-t",
            isDark
              ? "border-white/5 bg-white/5"
              : "border-gray-100 bg-gray-50/30"
          )}
        >
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest italic">
            RECORDS: {filteredItems.length}
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

      {/* SIDE DRAWER & MODAL (Existing) */}
      {viewingRecord && (
        // ... Side drawer code remains the same as in your original snippet
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in"
            onClick={() => setViewingRecord(null)}
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
              onClick={() => setViewingRecord(null)}
              className="absolute top-8 right-8 text-slate-500 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
            <header className="mb-12 pt-6">
              <span className="px-4 py-1.5 rounded-full text-[9px] font-black border border-emerald-500/50 text-emerald-500 mb-6 inline-block uppercase tracking-[0.2em]">
                Destruction Certificate
              </span>
              <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase italic text-emerald-500">
                {viewingRecord.id}
              </h2>
              <p className="font-mono text-gray-500 text-sm font-black tracking-[0.1em] uppercase opacity-80">
                Linked Asset: {viewingRecord.assetId}
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
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                  <Building2 size={16} /> Destruction Logistics
                </h3>
                <div className="grid grid-cols-1 gap-y-10 text-sm">
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      Authorized Entity
                    </p>
                    <p className="font-black text-lg">
                      {viewingRecord.company}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      Sanitization Method
                    </p>
                    <p className="font-black tracking-tight flex items-center gap-2 text-emerald-500">
                      <ShieldAlert size={16} /> {viewingRecord.method}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  "rounded-3xl p-8 border shadow-inner",
                  isDark
                    ? "bg-white/5 border-white/5"
                    : "bg-gray-50 border-gray-100"
                )}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} /> Completion Date
                  </span>
                  <span className="font-mono text-sm font-black">
                    {viewingRecord.date || "PENDING"}
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      )}

      <DisposalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecord(null);
        }}
        onSave={handleSave}
        initialData={selectedRecord}
        isDark={isDark}
      />
    </Layout>
  );
};

export default Disposal;
