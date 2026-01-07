import React, { useState, useMemo } from "react";
import { Layout } from "../component/Layout";
import {
  Archive as ArchiveIcon,
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  SquareArrowOutUpLeft,
  Download,
  AlertTriangle,
  Loader2,
  Database,
  Filter,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";
import { ArchivesModal, type ArchiveRecord } from "../models/ArchivesModal";

const Archives = () => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ArchiveRecord | null>(
    null
  );
  const [viewingRecord, setViewingRecord] = useState<ArchiveRecord | null>(
    null
  );

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", sub: "" });

  const itemsPerPage = 6;

  const [records, setRecords] = useState<ArchiveRecord[]>([
    {
      id: "ARC-2023-001",
      fileName: "Q4_Financial_Audit.zip",
      type: "Financial",
      dateArchived: "2023-12-15",
      size: "154MB",
    },
    {
      id: "ARC-2024-002",
      fileName: "Employee_Records_Legacy.db",
      type: "HR",
      dateArchived: "2024-01-20",
      size: "2.4GB",
    },
    {
      id: "ARC-2024-003",
      fileName: "Project_Nebula_Source.tar.gz",
      type: "Technical",
      dateArchived: "2024-02-10",
      size: "890MB",
    },
  ]);

  const archiveTypes = ["All", "Financial", "HR", "Technical", "Legal"];

  // --- Logic: Trigger Toast ---
  const triggerToast = (title: string, sub: string) => {
    setToastMessage({ title, sub });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // --- Logic: Export CSV ---
  const downloadCSV = () => {
    const headers = [
      "Record ID",
      "File Name",
      "Classification",
      "Archive Date",
      "Size",
    ];
    const csvContent = [
      headers.join(","),
      ...records.map((r) =>
        [r.id, `"${r.fileName}"`, r.type, r.dateArchived, r.size].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `vault_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Export Successful", "Vault manifest saved to CSV");
  };

  // --- Handlers ---
  const handleSave = (data: ArchiveRecord) => {
    if (selectedRecord) {
      setRecords(records.map((r) => (r.id === selectedRecord.id ? data : r)));
      triggerToast("Vault Updated", "Archive metadata synchronized");
    } else {
      setRecords([data, ...records]);
      triggerToast("File Archived", "New entry committed to cold storage");
    }
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRecords(records.filter((r) => r.id !== deleteId));
    triggerToast("Archive Purged", `Record ${deleteId} removed from vault`);
    setDeleteId(null);
    setIsDeleting(false);
    if (viewingRecord?.id === deleteId) setViewingRecord(null);
  };

  // --- Logic: Search & Filter ---
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === "All" || r.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterType, records]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginated = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout title="Cold Storage" icon={ArchiveIcon}>
      {/* 1. DELETE CONFIRMATION MODAL */}
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
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-black mb-2 tracking-tighter uppercase text-red-500">
              Purge Record?
            </h3>
            <p className="text-[10px] text-gray-500 mb-8 font-mono tracking-widest uppercase">
              PERMANENTLY DELETING RECORD: {deleteId}
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

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[400] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={cn(
              "flex items-center gap-4 px-8 py-5 rounded-[2rem] shadow-2xl border",
              isDark
                ? "bg-[#111118] border-amber-500/50 text-amber-400"
                : "bg-white border-amber-100 text-amber-600"
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
            Archive Vault
          </h2>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            Secure long-term data preservation
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
            className="h-12 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-500/20 px-8"
          >
            <Plus size={16} className="mr-2" /> Archive File
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div
        className={cn(
          "p-4 rounded-2xl mb-6 border shadow-sm flex flex-col md:flex-row gap-4",
          isDark ? "bg-[#111118] border-white/5" : "bg-white border-gray-100"
        )}
      >
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            placeholder="Search vault index..."
            className={cn(
              "w-full pl-12 pr-4 py-3 rounded-xl text-sm outline-none transition-all",
              isDark
                ? "bg-black/20 border-white/10 text-white focus:border-blue-500/50"
                : "bg-gray-50 border-gray-200"
            )}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="relative min-w-[180px]">
          <Filter
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            className={cn(
              "w-full pl-12 pr-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer border",
              isDark
                ? "bg-black/20 border-white/10 text-gray-400 focus:border-blue-500/50"
                : "bg-gray-50 border-gray-200 text-gray-600"
            )}
          >
            {archiveTypes.map((type) => (
              <option
                key={type}
                value={type}
                className={isDark ? "bg-[#0d0d12]" : "bg-white"}
              >
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Content */}
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
                <th className="px-8 py-5">Record Identifier</th>
                <th className="px-8 py-5">Data Classification</th>
                <th className="px-8 py-5">Archive Date</th>
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
                      isDark ? "hover:bg-white/[0.02]" : "hover:bg-amber-50/30"
                    )}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                          <Database size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={cn(
                              "font-black",
                              isDark ? "text-gray-200" : "text-gray-900"
                            )}
                          >
                            {r.fileName}
                          </span>
                          <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                            {r.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-tighter">
                        {r.type}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-mono text-[11px] text-gray-500 font-bold uppercase">
                      {r.dateArchived}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-amber-500"
                          onClick={() => setViewingRecord(r)}
                        >
                          <SquareArrowOutUpLeft size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-amber-500"
                          onClick={() => {
                            setSelectedRecord(r);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-red-500"
                          onClick={() => setDeleteId(r.id)}
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
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div
          className={cn(
            "px-8 py-5 flex items-center justify-between border-t",
            isDark
              ? "border-white/5 bg-white/5"
              : "border-gray-100 bg-gray-50/30"
          )}
        >
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest italic">
            VAULT CAPACITY: {filteredRecords.length} ITEMS
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

      {/* DETAIL SIDE DRAWER (previously fixed) */}
      {viewingRecord && (
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
              <span className="px-4 py-1.5 rounded-full text-[9px] font-black border border-amber-500/50 text-amber-500 mb-6 inline-block uppercase tracking-[0.2em]">
                Cold Storage Record
              </span>
              <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase break-all">
                {viewingRecord.fileName}
              </h2>
              <p className="font-mono text-amber-500 text-sm font-black tracking-[0.1em] uppercase opacity-80">
                {viewingRecord.id}
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
                <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                  <FileText size={16} /> Technical Metadata
                </h3>
                <div className="grid grid-cols-2 gap-y-10 text-sm">
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      Classification
                    </p>
                    <p className="font-black text-lg">{viewingRecord.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      Volume Size
                    </p>
                    <p className="font-mono text-amber-500 font-black text-lg uppercase">
                      {viewingRecord.size}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      Archive Timestamp
                    </p>
                    <p className="font-mono font-black">
                      {viewingRecord.dateArchived}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                <Button className="w-full justify-center bg-amber-600 hover:bg-amber-700 font-black text-[10px] uppercase tracking-[0.2em] h-14 rounded-2xl shadow-xl shadow-amber-900/20">
                  <Download size={18} className="mr-3" /> Restore From Archive
                </Button>
                <p className="text-[9px] text-center text-gray-500 font-black uppercase tracking-widest italic">
                  Verification via hardware security key required for
                  restoration
                </p>
              </div>
            </section>
          </aside>
        </div>
      )}

      <ArchivesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedRecord}
        isDark={isDark}
      />
    </Layout>
  );
};

export default Archives;
