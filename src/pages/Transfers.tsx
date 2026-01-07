import React, { useState, useMemo, useEffect } from "react";
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
  MapPin,
  SquareArrowOutUpLeft,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";
import { TransfersModal } from "../models/TransfersModal";

interface TransferRecord {
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

  // Enhanced Toast State
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const itemsPerPage = 5;

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

  // --- Toast Logic ---
  const triggerToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(
        () => setToast((prev) => ({ ...prev, show: false })),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Reset pagination when searching or filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // --- Handlers ---
  const handleSaveTransfer = (data: any) => {
    if (selectedTransfer) {
      // Edit Mode
      setTransfers(
        transfers.map((t) =>
          t.id === selectedTransfer.id ? { ...t, ...data } : t
        )
      );
      triggerToast("Transfer manifest updated");
    } else {
      // Create Mode
      const newRecord: TransferRecord = {
        id: `TRF-${Math.floor(1000 + Math.random() * 9000)}`,
        assetId: data.assetId,
        assetName: data.assetName || "Pending Verification",
        fromLocation: data.from || "Main Inventory",
        toLocation: data.to || "Unknown",
        status: "Pending",
        date: new Date().toISOString().split("T")[0],
        priority: data.priority || "Standard",
      };
      setTransfers([newRecord, ...transfers]);
      triggerToast("Transfer initiated successfully");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to cancel and remove this transfer record?"
      )
    ) {
      setTransfers((prev) => prev.filter((t) => t.id !== id));
      triggerToast("Transfer record deleted", "error");
      if (viewingTransfer?.id === id) setViewingTransfer(null);
    }
  };

  const downloadCSV = () => {
    const headers = ["ID", "Asset", "Origin", "Destination", "Status", "Date"];
    const csvContent = [
      headers.join(","),
      ...transfers.map((t) =>
        [
          t.id,
          t.assetName,
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
      `transfers_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast("CSV Exported successfully");
  };

  // --- Filter Logic ---
  const filtered = useMemo(() => {
    return transfers.filter((t) => {
      const matchesSearch =
        t.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, transfers]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout title="Logistics & Transit" icon={Truck}>
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-10 right-10 z-[200] animate-in slide-in-from-bottom-5 fade-in">
          <div
            className={cn(
              "flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md",
              isDark
                ? "bg-[#111118]/90 text-white"
                : "bg-white/90 text-gray-900",
              toast.type === "success"
                ? "border-emerald-500/50"
                : "border-red-500/50"
            )}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={20} className="text-emerald-500" />
            ) : (
              <AlertCircle size={20} className="text-red-500" />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-black">{toast.message}</span>
              <span className="text-[10px] opacity-70 uppercase tracking-widest">
                System Log Updated
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
              "text-2xl font-black tracking-tight",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            Asset Transfers
          </h2>
          <p className="text-sm text-gray-500">
            Relocation and deployment logistics
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="border-slate-700/50 hover:bg-slate-500/10"
          >
            <Download size={18} className="mr-2" /> Export CSV
          </Button>
          <Button
            className="bg-blue-600 shadow-lg shadow-blue-500/20"
            onClick={() => {
              setSelectedTransfer(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={18} className="mr-2" /> Initiate Transfer
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div
        className={cn(
          "p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm",
          isDark
            ? "bg-[#111118] border border-white/5"
            : "bg-white border border-gray-100"
        )}
      >
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            placeholder="Search transfer ID or asset..."
            className={cn(
              "w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none",
              isDark
                ? "bg-black/20 border-white/10 text-white"
                : "bg-gray-50 border-gray-200"
            )}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className={cn(
            "px-3 py-2 rounded-lg text-sm outline-none w-full md:w-48",
            isDark
              ? "bg-black/20 border border-white/10 text-white font-bold"
              : "bg-gray-50 border border-gray-200 font-bold"
          )}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Transit">In Transit</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Table */}
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
                "text-[10px] uppercase tracking-widest font-black",
                isDark ? "bg-white/5 text-gray-400" : "bg-gray-50 text-gray-500"
              )}
            >
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Asset</th>
              <th className="px-6 py-4">Route</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody
            className={cn(
              "divide-y",
              isDark ? "divide-white/5" : "divide-gray-50"
            )}
          >
            {paginated.map((t) => (
              <tr
                key={t.id}
                className={cn(
                  "text-sm transition-colors",
                  isDark ? "hover:bg-white/5" : "hover:bg-blue-50/50"
                )}
              >
                <td className="px-6 py-4 font-mono text-xs text-blue-500 font-bold">
                  {t.id}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        "font-bold",
                        isDark ? "text-gray-200" : "text-gray-700"
                      )}
                    >
                      {t.assetName}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {t.assetId}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">{t.fromLocation}</span>
                    <ArrowRightLeft size={12} className="text-blue-500" />
                    <span className="font-bold">{t.toLocation}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-black uppercase",
                      t.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : t.status === "In Transit"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-amber-500/10 text-amber-500"
                    )}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-yellow-500"
                      onClick={() => setViewingTransfer(t)}
                    >
                      <SquareArrowOutUpLeft size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500"
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
                      className="h-8 w-8 text-red-500"
                      onClick={() => handleDelete(t.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div
          className={cn(
            "px-6 py-4 flex items-center justify-between border-t",
            isDark
              ? "border-white/5 bg-white/5"
              : "border-gray-100 bg-gray-50/30"
          )}
        >
          <span className="text-xs text-gray-500 font-mono italic">
            LOGS: {filtered.length} UNITS
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
            <span className="text-[10px] font-black w-12 text-center">
              {currentPage} / {totalPages || 1}
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

      {/* Detail Drawer */}
      {viewingTransfer && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setViewingTransfer(null)}
          />
          <aside
            className={cn(
              "relative w-full max-w-lg h-full p-10 animate-slide-in-right border-l",
              isDark
                ? "bg-[#0d0d12] border-white/10 text-white"
                : "bg-white border-gray-200 text-gray-900"
            )}
          >
            <button
              onClick={() => setViewingTransfer(null)}
              className="absolute top-6 right-6 text-slate-500 hover:text-red-500"
            >
              <X size={24} />
            </button>
            <header className="mb-10">
              <span className="px-3 py-1 rounded-lg text-[10px] font-black border border-blue-500/50 text-blue-500 mb-4 inline-block uppercase">
                Logistics Manifest
              </span>
              <h2 className="text-4xl font-black mb-2 tracking-tighter">
                {viewingTransfer.assetName}
              </h2>
              <p className="font-mono text-blue-500 text-sm font-bold">
                {viewingTransfer.id}
              </p>
            </header>
            <section className="space-y-8">
              <div
                className={cn(
                  "rounded-2xl p-6 border",
                  isDark
                    ? "bg-white/5 border-white/5"
                    : "bg-gray-50 border-gray-100"
                )}
              >
                <h3 className="text-[10px] font-black text-indigo-400 uppercase mb-4">
                  Route Details
                </h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm font-mono">
                  <div className="text-slate-500 uppercase text-[10px] font-black">
                    Origin
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <MapPin size={12} /> {viewingTransfer.fromLocation}
                  </div>
                  <div className="text-slate-500 uppercase text-[10px] font-black">
                    Destination
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <MapPin size={12} /> {viewingTransfer.toLocation}
                  </div>
                  <div className="text-slate-500 uppercase text-[10px] font-black">
                    Priority
                  </div>
                  <div
                    className={cn(
                      "font-black",
                      viewingTransfer.priority === "High"
                        ? "text-red-500"
                        : "text-green-500"
                    )}
                  >
                    {viewingTransfer.priority}
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      )}

      <TransfersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransfer}
        initialData={selectedTransfer}
        isDark={isDark}
      />
    </Layout>
  );
};

export default Transfers;
