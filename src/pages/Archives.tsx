import React, { useState, useMemo } from "react";
import { Layout } from "../component/Layout";
import {
  Archive as ArchiveIcon,
  Plus,
  Edit2,
  Trash2,
  Search,
  SquareArrowOutUpLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Database,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ArchiveRecord | null>(
    null
  );
  const [viewingRecord, setViewingRecord] = useState<ArchiveRecord | null>(
    null
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", sub: "" });

  const itemsPerPage = 5;

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

  // --- Handlers ---
  const handleSave = (data: ArchiveRecord) => {
    if (selectedRecord) {
      setRecords(records.map((r) => (r.id === selectedRecord.id ? data : r)));
      setToastMessage({
        title: "Vault Updated",
        sub: "Archive metadata synchronized",
      });
    } else {
      setRecords([data, ...records]);
      setToastMessage({
        title: "File Archived",
        sub: "New entry committed to cold storage",
      });
    }
    setIsModalOpen(false);
    triggerToast();
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "CRITICAL: This will permanently purge the archive reference. This action cannot be reversed. Continue?"
      )
    ) {
      setRecords(records.filter((r) => r.id !== id));
      setToastMessage({
        title: "Archive Purged",
        sub: "Record removed from vault index",
      });
      triggerToast();
    }
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const downloadCSV = () => {
    const headers = [
      "Vault ID",
      "File Name",
      "Data Type",
      "Date Archived",
      "Size",
    ];
    const csvData = records.map((r) =>
      [r.id, `"${r.fileName}"`, r.type, r.dateArchived, r.size].join(",")
    );
    const blob = new Blob([[headers.join(","), ...csvData].join("\n")], {
      type: "text/csv",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vault_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    setToastMessage({
      title: "Export Successful",
      sub: "Vault logs saved to CSV",
    });
    triggerToast();
  };

  // --- Logic: Search & Pagination ---
  const filteredRecords = useMemo(() => {
    return records.filter(
      (r) =>
        r.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, records]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginated = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout title="Cold Storage" icon={ArchiveIcon}>
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2
            className={cn(
              "text-2xl font-black tracking-tight",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            Archive Vault
          </h2>
          <p className="text-sm text-gray-500">
            Secure long-term data preservation
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="hidden md:flex border-slate-700/50 hover:bg-slate-500/10"
          >
            <FileSpreadsheet size={18} className="mr-2" /> Export Logs
          </Button>
          <Button
            onClick={() => {
              setSelectedRecord(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={18} className="mr-2" /> Archive File
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div
        className={cn(
          "p-4 rounded-xl mb-6 flex gap-4 shadow-sm",
          isDark ? "bg-[#111118] border border-white/5" : "bg-white border"
        )}
      >
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            placeholder="Search vault index..."
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

      {/* Table Section */}
      <div
        className={cn(
          "rounded-xl border overflow-hidden",
          isDark ? "border-white/5 bg-[#111118]" : "bg-white shadow-sm"
        )}
      >
        <table className="w-full text-left">
          <thead>
            <tr
              className={cn(
                "text-[10px] uppercase font-black tracking-widest",
                isDark ? "bg-white/5 text-gray-400" : "bg-gray-50 text-gray-500"
              )}
            >
              <th className="px-6 py-4">Vault ID</th>
              <th className="px-6 py-4">File Name</th>
              <th className="px-6 py-4">Date Archived</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginated.map((r) => (
              <tr
                key={r.id}
                className={cn(
                  "text-sm transition-colors",
                  isDark ? "hover:bg-white/5" : "hover:bg-blue-50/30"
                )}
              >
                <td className="px-6 py-4 font-mono text-xs text-blue-500 font-bold">
                  {r.id}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold">{r.fileName}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-black">
                      {r.type}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                  {r.dateArchived}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-yellow-500"
                      onClick={() => setViewingRecord(r)}
                    >
                      <SquareArrowOutUpLeft size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500"
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
                      className="h-8 w-8 text-red-500"
                      onClick={() => handleDelete(r.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div
          className={cn(
            "px-6 py-4 flex items-center justify-between border-t",
            isDark ? "border-white/5 bg-white/5" : "border-gray-100"
          )}
        >
          <span className="text-xs text-gray-500 font-mono">
            OBJECTS: {filteredRecords.length}
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
            <span className="text-[10px] font-black w-8 text-center">
              {currentPage}
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

      {/* Details Drawer */}
      {viewingRecord && (
        <div className="fixed inset-0 z-[300] flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setViewingRecord(null)}
          />
          <aside
            className={cn(
              "relative w-full max-w-lg h-full p-10 border-l animate-in slide-in-from-right duration-300",
              isDark ? "bg-[#0d0d12] border-white/10 text-white" : "bg-white"
            )}
          >
            <button
              onClick={() => setViewingRecord(null)}
              className="absolute top-6 right-6 text-gray-500 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
            <span className="px-3 py-1 rounded-lg text-[10px] font-black border border-blue-500/50 text-blue-500 mb-4 inline-block tracking-widest">
              ENCRYPTED OBJECT
            </span>
            <h2 className="text-4xl font-black mb-1 tracking-tighter uppercase">
              {viewingRecord.fileName}
            </h2>
            <p className="text-blue-500 font-mono text-xs mb-8">
              {viewingRecord.id}
            </p>

            <div
              className={cn(
                "p-6 rounded-2xl border mb-6",
                isDark
                  ? "bg-white/5 border-white/5"
                  : "bg-gray-50 border-gray-100"
              )}
            >
              <div className="grid grid-cols-2 gap-y-6 text-sm">
                <div>
                  <p className="text-gray-500 font-black uppercase text-[10px] mb-1">
                    Total Size
                  </p>
                  <p className="font-mono flex items-center gap-2">
                    <Database size={14} /> {viewingRecord.size}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 font-black uppercase text-[10px] mb-1">
                    Data Type
                  </p>
                  <p className="font-mono">{viewingRecord.type}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-black uppercase text-[10px] mb-1">
                    Archive Date
                  </p>
                  <p className="font-mono">{viewingRecord.dateArchived}</p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-blue-500/20 text-blue-500 hover:bg-blue-500/10 py-6 font-black uppercase tracking-widest text-[10px]"
            >
              <Download size={16} className="mr-2" /> Restore from Vault
            </Button>
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
