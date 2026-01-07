import React, { useState, useMemo } from "react";
import { Layout } from "../component/Layout";
import {
  Truck,
  Plus,
  Edit2,
  Trash2,
  Search,
  ArrowRightLeft,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  SquareArrowOutUpLeft,
  AlertTriangle,
  Loader2,
  Filter,
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";
import { TransfersModal } from "../models/TransfersModal";

export interface TransferRecord {
  id: string;
  assetId: string;
  assetName: string;
  fromLocation: string;
  toLocation: string;
  status: "In Transit" | "Completed" | "Pending";
  date: string;
  priority: "High" | "Standard";
}

const Transfers = () => {
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
  const [selectedTransfer, setSelectedTransfer] =
    useState<TransferRecord | null>(null);
  const [viewingTransfer, setViewingTransfer] = useState<TransferRecord | null>(
    null
  );

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", sub: "" });

  const itemsPerPage = 6;

  const [transfers, setTransfers] = useState<TransferRecord[]>([
    {
      id: "TRF-9901",
      assetId: "AST-442",
      assetName: "Dell Server Rack",
      fromLocation: "Data Center A",
      toLocation: "DR Site",
      status: "In Transit",
      date: "2024-03-10",
      priority: "High",
    },
    {
      id: "TRF-9902",
      assetId: "AST-109",
      assetName: "Workstation Bundle",
      fromLocation: "Main Warehouse",
      toLocation: "Branch North",
      status: "Completed",
      date: "2024-03-08",
      priority: "Standard",
    },
  ]);

  // --- Helpers ---
  const triggerToast = (title: string, sub: string) => {
    setToastMessage({ title, sub });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = (data: TransferRecord) => {
    if (selectedTransfer) {
      setTransfers(
        transfers.map((t) => (t.id === selectedTransfer.id ? data : t))
      );
      triggerToast("Manifest Updated", "Logistics route synchronized");
    } else {
      setTransfers([data, ...transfers]);
      triggerToast("Transfer Initiated", "New manifest committed to logistics");
    }
    setIsModalOpen(false);
  };

  const downloadCSV = () => {
    const headers = ["ID", "Asset", "Origin", "Destination", "Status", "Date"];
    const csvContent = [
      headers.join(","),
      ...transfers.map((t) =>
        [
          t.id,
          `"${t.assetName}"`,
          t.fromLocation,
          t.toLocation,
          t.status,
          t.date,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `logistics_export_${new Date().getTime()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Manifest Exported", "Logistics data saved successfully");
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setTransfers(transfers.filter((t) => t.id !== deleteId));
    triggerToast("Record Purged", `Manifest ${deleteId} removed from log`);
    setDeleteId(null);
    setIsDeleting(false);
    if (viewingTransfer?.id === deleteId) setViewingTransfer(null);
  };

  // --- Search & Filter Logic ---
  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      const matchesSearch =
        t.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, transfers]);

  const totalPages = Math.ceil(filteredTransfers.length / itemsPerPage);
  const paginated = filteredTransfers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout title="Logistics & Transit" icon={Truck}>
      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div
            className={cn(
              "p-8 rounded-[2.5rem] border max-w-sm w-full text-center shadow-2xl",
              isDark
                ? "bg-[#0d0d12] border-white/10"
                : "bg-white border-gray-200"
            )}
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-black mb-2 tracking-tighter uppercase text-red-500">
              Purge Manifest?
            </h3>
            <p className="text-[10px] text-gray-500 mb-8 font-mono tracking-widest uppercase">
              ID: {deleteId}
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 rounded-2xl font-black text-[10px] uppercase tracking-widest"
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

      {/* TOAST */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[400] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={cn(
              "flex items-center gap-4 px-8 py-5 rounded-[2rem] shadow-2xl border",
              isDark
                ? "bg-[#111118] border-blue-500/50 text-blue-400"
                : "bg-white border-blue-100 text-blue-600"
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

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2
            className={cn(
              "text-2xl font-black tracking-tight uppercase",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            Logistics Center
          </h2>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            Asset Relocation & Deployments
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="h-12 rounded-xl border-slate-700/50 font-black text-[10px] uppercase tracking-widest"
          >
            <Download size={16} className="mr-2" /> Export Manifest
          </Button>
          <Button
            onClick={() => {
              setSelectedTransfer(null);
              setIsModalOpen(true);
            }}
            className="h-12 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 px-8"
          >
            <Plus size={16} className="mr-2" /> New Transfer
          </Button>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
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
            placeholder="Search Manifest or Asset..."
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
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={cn(
              "w-full pl-12 pr-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer border transition-all",
              isDark
                ? "bg-black/20 border-white/10 text-gray-400 focus:border-blue-500/50"
                : "bg-gray-50 border-gray-200 text-gray-600"
            )}
          >
            <option value="All">ALL STATUSES</option>
            <option value="Pending">PENDING</option>
            <option value="In Transit">IN TRANSIT</option>
            <option value="Completed">COMPLETED</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
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
                <th className="px-8 py-5">Manifest ID</th>
                <th className="px-8 py-5">Route Path</th>
                <th className="px-8 py-5">Status</th>
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
                paginated.map((t) => (
                  <tr
                    key={t.id}
                    className={cn(
                      "text-sm transition-colors group",
                      isDark ? "hover:bg-white/[0.02]" : "hover:bg-blue-50/30"
                    )}
                  >
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-mono text-[11px] text-blue-500 font-black tracking-tighter uppercase">
                          {t.id}
                        </span>
                        <span
                          className={cn(
                            "font-black",
                            isDark ? "text-gray-200" : "text-gray-900"
                          )}
                        >
                          {t.assetName}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-tight">
                        <span className="text-gray-500">{t.fromLocation}</span>
                        <ArrowRightLeft size={12} className="text-blue-500" />
                        <span
                          className={isDark ? "text-gray-300" : "text-gray-700"}
                        >
                          {t.toLocation}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                          t.status === "Completed"
                            ? "bg-green-500/10 text-green-500"
                            : t.status === "In Transit"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-orange-500/10 text-orange-500"
                        )}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-blue-500"
                          onClick={() => setViewingTransfer(t)}
                        >
                          <SquareArrowOutUpLeft size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-blue-500"
                          onClick={() => {
                            setSelectedTransfer(t);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-red-500"
                          onClick={() => setDeleteId(t.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 opacity-50">
                      No matching manifests found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div
          className={cn(
            "px-8 py-5 flex items-center justify-between border-t",
            isDark ? "border-white/5 bg-white/5" : "border-gray-100"
          )}
        >
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
            Index: {filteredTransfers.length} Manifests
          </span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-xs font-black font-mono w-12 text-center">
              {currentPage} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      <TransfersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedTransfer}
        isDark={isDark}
      />

      {/* DRAWER/VIEWING SIDEBAR */}
      {viewingTransfer && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in"
            onClick={() => setViewingTransfer(null)}
          />
          <aside
            className={cn(
              "relative w-full max-w-lg h-full p-12 shadow-2xl animate-in slide-in-from-right duration-300 border-l",
              isDark
                ? "bg-[#0d0d12] border-white/10 text-white"
                : "bg-white border-gray-200"
            )}
          >
            <button
              onClick={() => setViewingTransfer(null)}
              className="absolute top-8 right-8 text-slate-500 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
            <header className="mb-12 pt-6">
              <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-2">
                {viewingTransfer.id}
              </h3>
              <p className="text-xs font-mono uppercase tracking-[0.3em] opacity-50">
                Manifest Details
              </p>
            </header>
            {/* Additional viewing details would go here */}
          </aside>
        </div>
      )}
    </Layout>
  );
};

export default Transfers;
