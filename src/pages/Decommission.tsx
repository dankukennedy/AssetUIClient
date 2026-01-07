import React, { useState, useMemo } from "react";
import { Layout } from "../component/Layout";
import {
  Plus,
  ShieldX,
  PowerOff,
  Download,
  AlertTriangle,
  Edit2,
  FileSearch,
  X,
  ShieldCheck,
  Calendar,
  UserCheck,
  History,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertOctagon,
  Loader2,
  CheckCircle2,
  Filter,
  Trash2,
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

  // --- Helpers ---
  const triggerToast = (title: string, sub: string) => {
    setToastMeta({ title, sub });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.assetId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || r.reason === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, records]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginated = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const confirmRevocation = async () => {
    if (!revokingId) return;
    setIsRevoking(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRecords(records.filter((r) => r.id !== revokingId));
    triggerToast("Audit Purged", "Record removed from system index");
    setRevokingId(null);
    setIsRevoking(false);
    if (viewingRecord?.id === revokingId) setViewingRecord(null);
  };

  return (
    <Layout title="Offline Protocol" icon={PowerOff}>
      {/* REVOCATION MODAL */}
      {revokingId && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
          <div
            className={cn(
              "p-10 rounded-[3rem] border max-w-sm w-full text-center shadow-2xl",
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
                  "Confirm Purge"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[1500] animate-in slide-in-from-right-10 fade-in">
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

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2
            className={cn(
              "text-4xl font-black tracking-tighter uppercase",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            Offline Protocol
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest font-bold">
              Registry Decommissioning Active
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="h-14 rounded-2xl border-white/10 px-6 font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            <Download size={16} className="mr-3" /> Export Audit
          </Button>
          <Button
            onClick={() => {
              setSelectedRecord(null);
              setIsModalOpen(true);
            }}
            className="h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white px-8 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-900/40 transition-all active:scale-95"
          >
            <Plus size={16} className="mr-3" /> New Protocol
          </Button>
        </div>
      </div>

      {/* WARNING BANNER */}
      <div
        className={cn(
          "mb-8 p-6 rounded-3xl border flex items-center gap-5",
          isDark
            ? "bg-red-500/5 border-red-500/20 text-red-400"
            : "bg-red-50 border-red-100 text-red-700"
        )}
      >
        <AlertTriangle size={24} className="shrink-0" />
        <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed">
          Permanent removal protocol engaged. Ensure data sanitation is verified
          before committing to the registry.
        </p>
      </div>

      {/* TOOLBAR */}
      <div
        className={cn(
          "p-4 rounded-3xl mb-8 flex flex-col md:flex-row gap-4 items-center border",
          isDark
            ? "bg-[#111118] border-white/5"
            : "bg-white border-gray-100 shadow-sm"
        )}
      >
        <div className="relative flex-1 w-full flex gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              placeholder="Search Protocol ID or Asset Ref..."
              className={cn(
                "w-full pl-14 pr-6 py-4 rounded-2xl text-sm outline-none transition-all font-medium",
                isDark
                  ? "bg-black/40 border-white/10 text-white focus:border-red-500/50"
                  : "bg-gray-50 border-gray-200"
              )}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

        </div>
        <div className="relative w-full md:w-72">
          <Filter
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <select
            className={cn(
              "w-full pl-12 pr-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none border cursor-pointer appearance-none",
              isDark
                ? "bg-black/40 border-white/10 text-white"
                : "bg-gray-50 border-gray-200"
            )}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="End of Life">End of Life</option>
            <option value="Damaged">Damaged</option>
            <option value="Surplus">Surplus</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div
        className={cn(
          "rounded-[2.5rem] border overflow-hidden",
          isDark
            ? "border-white/5 bg-[#111118]"
            : "bg-white border-gray-100 shadow-xl"
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr
                className={cn(
                  "text-[10px] uppercase tracking-[0.3em] font-black",
                  isDark
                    ? "bg-white/5 text-gray-500"
                    : "bg-gray-50 text-gray-400"
                )}
              >
                <th className="px-10 py-6">Protocol Identity</th>
                <th className="px-10 py-6">Asset Reference</th>
                <th className="px-10 py-6">Execution Date</th>
                <th className="px-10 py-6 text-right">Operations</th>
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
                      "text-sm transition-all group",
                      isDark ? "hover:bg-red-500/[0.03]" : "hover:bg-red-50/50"
                    )}
                  >
                    <td className="px-10 py-7 font-mono text-[11px] text-red-500 font-black tracking-tighter uppercase">
                      {r.id}
                    </td>
                    <td className="px-10 py-7 font-black uppercase tracking-tight text-gray-400 group-hover:text-gray-200 transition-colors">
                      {r.assetId}
                    </td>
                    <td className="px-10 py-7 font-mono text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      {r.decommissionDate}
                    </td>
                    <td className="px-10 py-7 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-11 w-11 rounded-xl text-gray-500 hover:text-emerald-500 hover:bg-emerald-500/10"
                          onClick={() => setViewingRecord(r)}
                        >
                          <FileSearch size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-11 w-11 rounded-xl text-gray-500 hover:text-blue-500 hover:bg-blue-500/10"
                          onClick={() => {
                            setSelectedRecord(r);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-11 w-11 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                          onClick={() => setRevokingId(r.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-10 py-20 text-center text-gray-500 italic text-[10px] uppercase tracking-[0.3em] font-black"
                  >
                    No matching protocols in active registry
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div
          className={cn(
            "px-10 py-6 flex items-center justify-between border-t",
            isDark
              ? "border-white/5 bg-white/[0.02]"
              : "border-gray-100 bg-gray-50/50"
          )}
        >
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest italic">
            {filteredRecords.length} Archived Protocols
          </span>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-[12px] font-black font-mono px-4">
              {currentPage} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* DRAWER */}
      {viewingRecord && (
        <div className="fixed inset-0 z-[1600] flex justify-end">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in"
            onClick={() => setViewingRecord(null)}
          />
          <aside
            className={cn(
              "relative w-full max-w-lg h-full p-16 shadow-2xl animate-in slide-in-from-right duration-500 border-l overflow-y-auto",
              isDark
                ? "bg-[#0d0d12] border-white/10 text-white"
                : "bg-white border-gray-200"
            )}
          >
            <button
              onClick={() => setViewingRecord(null)}
              className="absolute top-10 right-10 text-slate-500 hover:text-red-500 transition-colors"
            >
              <X size={32} />
            </button>
            <header className="mb-16 pt-10">
              <div className="flex items-center gap-2 text-red-500 mb-8">
                <ShieldCheck size={20} />
                <span className="px-5 py-2 rounded-full text-[10px] font-black border border-red-500/40 uppercase tracking-[0.3em]">
                  Verified Offline
                </span>
              </div>
              <h2 className="text-5xl font-black mb-4 tracking-tighter uppercase italic">
                {viewingRecord.id}
              </h2>
              <p className="font-mono text-red-500 text-lg font-black tracking-widest uppercase opacity-80">
                Asset Ref: {viewingRecord.assetId}
              </p>
            </header>

            <div
              className={cn(
                "rounded-[2.5rem] p-10 border shadow-inner mb-10",
                isDark
                  ? "bg-white/5 border-white/5"
                  : "bg-gray-50 border-gray-100"
              )}
            >
              <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                <History size={20} /> Audit Parameters
              </h3>
              <div className="space-y-10">
                <div>
                  <p className="text-gray-500 font-black uppercase text-[10px] tracking-[0.2em] mb-2">
                    Reason for Removal
                  </p>
                  <p className="font-black text-2xl italic leading-tight">
                    "{viewingRecord.reason}"
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[10px] tracking-[0.2em] mb-2">
                      Execution Date
                    </p>
                    <p className="font-black flex items-center gap-3 text-xl">
                      <Calendar size={20} className="text-red-500" />{" "}
                      {viewingRecord.decommissionDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 font-black uppercase text-[10px] tracking-[0.2em] mb-2">
                      Authorized By
                    </p>
                    <p className="font-black text-xl text-red-500 flex items-center justify-end gap-3">
                      {viewingRecord.approvedBy} <UserCheck size={20} />
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Button className="w-full justify-center bg-red-600 hover:bg-red-700 text-white font-black text-[12px] uppercase tracking-[0.3em] h-20 rounded-[2rem] shadow-2xl shadow-red-900/40 transition-all active:scale-95">
              Generate Formal Certificate
            </Button>
          </aside>
        </div>
      )}

      <DecommissionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecord(null);
        }}
        onSave={(data) => {
          if (selectedRecord) {
            setRecords(
              records.map((r) => (r.id === selectedRecord.id ? data : r))
            );
          } else {
            setRecords([data, ...records]);
          }
          setIsModalOpen(false);
          setSelectedRecord(null);
          triggerToast(
            selectedRecord ? "Protocol Updated" : "Protocol Executed",
            "System registry synchronized"
          );
        }}
        initialData={selectedRecord}
        isDark={isDark}
      />
    </Layout>
  );
};

export default Decommission;
