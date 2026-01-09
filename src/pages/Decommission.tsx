import React, { useState, useMemo } from "react";
import { Layout } from "../component/Layout";
import {
  Plus,
  PowerOff,
  Download,
  Edit2,
  X,
  ShieldCheck,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertOctagon,
  Loader2,
  CheckCircle2,
  Filter,
  Trash2,
  FileSearch,
  SquareArrowOutUpLeft,
  Edit3,
  InfoIcon,
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";
import {
  DecommissionModal,
  type DecomRecord,
} from "../models/DecommissionModal";

const Decommission = () => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DecomRecord | null>(
    null
  );
  const [viewingRecord, setViewingRecord] = useState<DecomRecord | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMeta, setToastMeta] = useState({ title: "", sub: "" });

  const itemsPerPage = 6;
  const [records, setRecords] = useState<DecomRecord[]>([
    {
      id: "DEC-001",
      assetId: "AST-882",
      reason: "End of Life",
      decommissionDate: "2024-05-12",
      approvedBy: "Admin",
    },
    {
      id: "DEC-002",
      assetId: "SRV-404",
      reason: "Damaged",
      decommissionDate: "2024-06-01",
      approvedBy: "Security_Lead",
    },
  ]);

  // Derived reasons for filter
  const reasonOptions = useMemo(() => {
    const reasons = new Set(records.map((r) => r.reason));
    return ["All", ...Array.from(reasons)];
  }, [records]);

  // --- UI Triggers ---
  const triggerToast = (title: string, sub: string) => {
    setToastMeta({ title, sub });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // --- Handlers ---
  const handleSaveProtocol = (data: DecomRecord) => {
    if (selectedRecord) {
      setRecords((prev) =>
        prev.map((r) => (r.id === selectedRecord.id ? data : r))
      );
      triggerToast("Protocol Updated", "System registry synchronized");
    } else {
      setRecords((prev) => [data, ...prev]);
      triggerToast("Protocol Executed", "New entry indexed in registry");
    }
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const confirmRevocation = async () => {
    if (!revokingId) return;
    setIsRevoking(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRecords((prev) => prev.filter((r) => r.id !== revokingId));
    if (viewingRecord?.id === revokingId) setViewingRecord(null);
    triggerToast("Audit Purged", "Record removed from system index");
    setRevokingId(null);
    setIsRevoking(false);
  };

  const downloadCSV = () => {
    const headers = ["Protocol ID", "Asset Ref", "Reason", "Date", "Auth By"];
    const csvContent = [
      headers.join(","),
      ...records.map((r) =>
        [
          r.id,
          r.assetId,
          `"${r.reason}"`,
          r.decommissionDate,
          r.approvedBy,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `decommission_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Audit Exported", "CSV registry file generated");
  };

  // --- Filtering Logic ---
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.approvedBy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || r.reason === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, records]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginated = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout title="Offline Protocol" icon={PowerOff}>
      {/* 1. PURGE DIALOG */}
      {revokingId && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className={cn(
              "p-10 rounded-[3rem] border max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95",
              isDark
                ? "bg-[#0d0d12] border-red-500/20"
                : "bg-white border-gray-100"
            )}
          >
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <AlertOctagon className="text-red-500" size={40} />
            </div>
            <h3 className="text-xl font-black mb-2 tracking-tighter uppercase text-red-500">
              Purge Protocol?
            </h3>
            <p className="text-[10px] text-gray-500 mb-8 font-mono tracking-widest uppercase">
              Registry ID: {revokingId}
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

      {/* 2. TOAST COMPONENT */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[1500] animate-in slide-in-from-bottom-5 fade-in">
          <div
            className={cn(
              "flex items-center gap-4 px-8 py-5 rounded-[2rem] shadow-2xl border",
              isDark
                ? "bg-[#111118] border-red-500/50 text-red-400"
                : "bg-white border-red-100 text-red-600"
            )}
          >
            <CheckCircle2 size={20} />
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-tight">
                {toastMeta.title}
              </span>
              <span className="text-[10px] opacity-70 uppercase font-bold tracking-[0.2em]">
                {toastMeta.sub}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. HEADER SECTION */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
        <div>
          <h2
            className={cn(
              "text-2xl font-black tracking-tight uppercase",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            Offline Protocol
          </h2>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            Audit trail for decommissioned hardware assets
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="flex-1 sm:flex-none  h-12 rounded-xl border-slate-700/50 hover:bg-slate-500/10 font-black text-[10px] uppercase tracking-widest"
          >
            <Download size={16} className="mr-2" /> Export Audit
          </Button>
          <Button
            onClick={() => {
              setSelectedRecord(null);
              setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-none h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20"
          >
            <Plus size={16} className="mr-2" /> New Protocol
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
            placeholder="Search Protocol ID or Asset Reference..."
            className={cn(
              "w-full pl-12 pr-4 py-3 rounded-xl text-sm outline-none transition-all",
              isDark
                ? "bg-black/20 border-white/10 text-white focus:border-red-500/50"
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
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={cn(
              "w-full pl-10 pr-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer",
              isDark
                ? "bg-black/20 border-white/10 text-white"
                : "bg-gray-50 border-gray-200"
            )}
          >
            {reasonOptions.map((opt) => (
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

      {/* 5. DATA TABLE / CARDS */}
      <div
        className={cn(
          "rounded-[2rem] border overflow-hidden",
          isDark
            ? "border-white/5 bg-[#111118]"
            : "bg-white shadow-sm border-gray-100"
        )}
      >
        {/* Desktop View */}
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
                <th className="px-8 py-5">Protocol ID</th>
                <th className="px-8 py-5">Asset Reference</th>
                <th className="px-8 py-5">Reason</th>
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
                paginated.map((r) => (
                  <tr
                    key={r.id}
                    className={cn(
                      "text-sm transition-colors group",
                      isDark ? "hover:bg-white/[0.02]" : "hover:bg-red-50/30"
                    )}
                  >
                    <td className="px-8 py-5 font-mono text-[11px] text-red-500 font-black tracking-tighter uppercase">
                      {r.id}
                    </td>
                    <td className="px-8 py-5 font-black uppercase">
                      {r.assetId}
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-500">
                        {r.reason}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-red-500"
                          onClick={() => setViewingRecord(r)}
                        >
                          <SquareArrowOutUpLeft
                            size={14}
                            className="h-8 w-8 text-teal-500"
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-red-500"
                          onClick={() => {
                            setSelectedRecord(r);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit3
                            size={14}
                            className="h-8 w-8 text-yellow-500"
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-red-600"
                          onClick={() => setRevokingId(r.id)}
                        >
                          <Trash2 size={14} className="h-8 w-8 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-8 py-20 text-center font-mono text-xs text-gray-500 uppercase tracking-widest"
                  >
                    No audit records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-white/5">
          {paginated.map((r) => (
            <div key={r.id} className="p-6 flex flex-col gap-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-[10px] text-red-500 font-black tracking-tighter uppercase mb-1">
                    {r.id}
                  </p>
                  <h4
                    className={cn(
                      "font-black text-lg",
                      isDark ? "text-white" : "text-gray-900"
                    )}
                  >
                    {r.assetId}
                  </h4>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                    {r.reason}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-11 bg-teal-300 border-white/10 text-[9px] uppercase font-black tracking-widest"
                  onClick={() => setViewingRecord(r)}
                >
                  Details <InfoIcon className="ml-2 text-teal-900" />
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-11 bg-yellow-100 border-white/10 text-[9px] uppercase font-black tracking-widest"
                  onClick={() => {
                    setSelectedRecord(r);
                    setIsModalOpen(true);
                  }}
                >
                  Update <Edit3 className="ml-2 text-amber-900" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 text-red-500/50"
                  onClick={() => setRevokingId(r.id)}
                >
                  <Trash2 size={16} className="h-8 w-8 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div
          className={cn(
            "px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t",
            isDark
              ? "border-white/5 bg-white/5"
              : "border-gray-100 bg-gray-50/30"
          )}
        >
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest italic">
            TOTAL RECORDS: {filteredRecords.length}
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

      {/* 6. SIDE DRAWER (Details) */}
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
              className="absolute top-8 right-8 text-slate-500 hover:text-red-500"
            >
              <X size={24} />
            </button>
            <header className="mb-12 pt-6">
              <span className="px-4 py-1.5 rounded-full text-[9px] font-black border border-red-500/50 text-red-500 mb-6 inline-block uppercase tracking-[0.2em]">
                Offline Protocol
              </span>
              <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tighter uppercase">
                {viewingRecord.assetId}
              </h2>
              <p className="font-mono text-red-500 text-sm font-black tracking-[0.1em] uppercase">
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
                <h3 className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                  <AlertOctagon size={16} /> Audit Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 text-sm">
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] mb-2">
                      Decom Reason
                    </p>
                    <p className="font-black text-lg">{viewingRecord.reason}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] mb-2">
                      Authored By
                    </p>
                    <p className="font-black text-lg uppercase text-red-500">
                      {viewingRecord.approvedBy}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] mb-2">
                      Execution Date
                    </p>
                    <p className="font-mono font-black">
                      {viewingRecord.decommissionDate}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-white/5 space-y-4">
                <Button className="w-full justify-center bg-red-600 hover:bg-red-700 font-black text-[10px] uppercase tracking-[0.2em] h-14 rounded-2xl shadow-xl shadow-red-900/20">
                  <ShieldCheck size={18} className="mr-3" /> Verify Compliance
                </Button>
              </div>
            </section>
          </aside>
        </div>
      )}

      <DecommissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProtocol}
        initialData={selectedRecord}
        isDark={isDark}
      />
    </Layout>
  );
};

export default Decommission;
