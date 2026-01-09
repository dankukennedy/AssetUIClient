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
  FileText,
  Edit3,
  InfoIcon,
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

  const triggerToast = (title: string, sub: string) => {
    setToastMessage({ title, sub });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

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
      {/* 1. DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div
            className={cn(
              "p-8 rounded-[2.5rem] border max-w-sm w-full text-center shadow-2xl",
              isDark
                ? "bg-[#0d0d12] border-white/10"
                : "bg-white border-gray-200"
            )}
          >
            <AlertTriangle className="text-red-500 mx-auto mb-6" size={32} />
            <h3 className="text-xl font-black mb-2 uppercase text-red-500">
              Purge Record?
            </h3>
            <p className="text-[10px] text-gray-500 mb-8 font-mono uppercase tracking-widest">
              DELETING: {deleteId}
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 rounded-2xl font-black text-[10px] uppercase"
                onClick={() => setDeleteId(null)}
              >
                Abort
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-[10px] uppercase"
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

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[400] animate-in slide-in-from-bottom-5">
          <div
            className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-[2rem] shadow-2xl border",
              isDark
                ? "bg-[#111118] border-amber-500/50 text-amber-400"
                : "bg-white border-amber-100 text-amber-600"
            )}
          >
            <CheckCircle2 size={20} />
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase">
                {toastMessage.title}
              </span>
              <span className="text-[9px] opacity-70 uppercase font-bold">
                {toastMessage.sub}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
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
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="flex-1 sm:flex-none h-12 bg-green-800 rounded-xl border-slate-700/50 font-black text-[10px] uppercase tracking-widest"
          >
            <Download size={16} className="mr-2" /> Export CSV
          </Button>
          <Button
            onClick={() => {
              setSelectedRecord(null);
              setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-none h-12 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-500/20 px-8"
          >
            <Plus size={16} className="mr-2" /> Archive File
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
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
              "w-full pl-12 pr-4 py-3 rounded-xl text-sm outline-none",
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
        <div className="relative">
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
              "w-full md:w-[180px] pl-12 pr-4 py-3 rounded-xl text-[10px] font-black uppercase outline-none appearance-none cursor-pointer border",
              isDark
                ? "bg-black/20 border-white/10 text-gray-400"
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

      {/* Main Content Wrapper */}
      <div
        className={cn(
          "rounded-[2rem] border overflow-hidden",
          isDark
            ? "border-white/5 bg-[#111118]"
            : "bg-white shadow-sm border-gray-100"
        )}
      >
        {/* DESKTOP TABLE (Visible on md and up) */}
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
              {paginated.map((r) => (
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
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase">
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
                        <SquareArrowOutUpLeft
                          size={14}
                          className="h-8 w-8 text-teal-500"
                        />
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
                        <Edit3 size={14} className="h-8 w-8 text-yellow-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-gray-400 hover:text-red-500"
                        onClick={() => setDeleteId(r.id)}
                      >
                        <Trash2 size={14} className="h-8 w-8 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD LIST (Visible on sm only) */}
        <div className="md:hidden divide-y divide-white/5">
          {paginated.length > 0 ? (
            paginated.map((r) => (
              <div key={r.id} className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                      <Database size={18} />
                    </div>
                    <div>
                      <h4
                        className={cn(
                          "font-black text-sm",
                          isDark ? "text-white" : "text-gray-900"
                        )}
                      >
                        {r.fileName}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-mono">
                        {r.id}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-600 text-[9px] font-black uppercase">
                    {r.type}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <span>Date: {r.dateArchived}</span>
                  <span>Size: {r.size}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-teal-300 h-10 text-[9px] uppercase font-black"
                    onClick={() => setViewingRecord(r)}
                  >
                    Details <InfoIcon className="ml-2 text-teal-900" />
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-yellow-100 h-10 text-[9px] uppercase font-black"
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
                    className="h-10 w-10 text-red-500/50"
                    onClick={() => setDeleteId(r.id)}
                  >
                    <Trash2 size={16} className="h-8 w-8 text-red-500" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-[10px] text-gray-500 uppercase">
              No records found
            </div>
          )}
        </div>

        {/* Pagination bar */}
        <div
          className={cn(
            "px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t",
            isDark
              ? "border-white/5 bg-white/5"
              : "border-gray-100 bg-gray-50/30"
          )}
        >
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest italic text-center sm:text-left">
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

      {/* Side Drawer - Adjusted padding for mobile */}
      {viewingRecord && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setViewingRecord(null)}
          />
          <aside
            className={cn(
              "relative w-full max-w-lg h-full p-6 md:p-12 shadow-2xl animate-in slide-in-from-right border-l overflow-y-auto",
              isDark
                ? "bg-[#0d0d12] border-white/10 text-white"
                : "bg-white border-gray-200 text-gray-900"
            )}
          >
            <button
              onClick={() => setViewingRecord(null)}
              className="absolute top-6 right-6 text-slate-500 hover:text-red-500"
            >
              <X size={24} />
            </button>
            <header className="mb-8 pt-6">
              <span className="px-4 py-1.5 rounded-full text-[9px] font-black border border-amber-500/50 text-amber-500 mb-6 inline-block uppercase">
                Cold Storage Record
              </span>
              <h2 className="text-2xl md:text-4xl font-black mb-2 tracking-tighter uppercase break-all">
                {viewingRecord.fileName}
              </h2>
              <p className="font-mono text-amber-500 text-xs font-black uppercase">
                {viewingRecord.id}
              </p>
            </header>
            <section className="space-y-6">
              <div
                className={cn(
                  "rounded-3xl p-6 md:p-8 border shadow-inner",
                  isDark
                    ? "bg-white/5 border-white/5"
                    : "bg-gray-50 border-gray-100"
                )}
              >
                <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <FileText size={16} /> Metadata
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 text-sm">
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] mb-1">
                      Classification
                    </p>
                    <p className="font-black text-lg">{viewingRecord.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] mb-1">
                      Volume Size
                    </p>
                    <p className="font-mono text-amber-500 font-black text-lg">
                      {viewingRecord.size}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] mb-1">
                      Archive Date
                    </p>
                    <p className="font-mono font-black">
                      {viewingRecord.dateArchived}
                    </p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-amber-600 hover:bg-amber-700 font-black text-[10px] uppercase h-14 rounded-2xl">
                <Download size={18} className="mr-3" /> Restore From Archive
              </Button>
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
