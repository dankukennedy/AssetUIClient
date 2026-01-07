import React, { useState, useMemo } from "react";
import { Layout } from "../component/Layout";
import {
  Truck,
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  CheckCircle2,
  SquareArrowOutUpLeft,
  ShieldCheck,
  Download,
  AlertOctagon,
  Loader2,
  Filter,
  ArrowRightLeft,
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";
import { TransfersModal, type TransferRecord } from "../models/TransfersModal";

const Transfers = () => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] =
    useState<TransferRecord | null>(null);
  const [viewingTransfer, setViewingTransfer] = useState<TransferRecord | null>(
    null
  );

  // Custom Purge States
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
    {
      id: "TRF-9903",
      assetId: "AST-202",
      assetName: "Cisco Firewall",
      fromLocation: "HQ Office",
      toLocation: "London Branch",
      status: "Pending",
      date: "2024-03-12",
      priority: "High",
    },
  ]);

  // Derived unique statuses for filter
  const statusOptions = useMemo(() => {
    const statuses = new Set(transfers.map((t) => t.status));
    return ["All Statuses", ...Array.from(statuses)];
  }, [transfers]);

  // --- Logic: Trigger Toast ---
  const triggerToast = (title: string, sub: string) => {
    setToastMessage({ title, sub });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // --- Handlers ---
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

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setTransfers(transfers.filter((t) => t.id !== deleteId));
    triggerToast("Record Purged", `Manifest ${deleteId} removed from logs`);

    setDeleteId(null);
    setIsDeleting(false);
    if (viewingTransfer?.id === deleteId) setViewingTransfer(null);
  };

  const downloadCSV = () => {
    const headers = [
      "ID",
      "Asset",
      "Origin",
      "Destination",
      "Status",
      "Date",
      "Priority",
    ];
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
          t.priority,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `logistics_manifest_${new Date().getTime()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Export Successful", "Logistics data saved to CSV");
  };

  // --- Logic: Search & Pagination ---
  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      const matchesSearch =
        t.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.toLocation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All Statuses" || t.status === statusFilter;

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
              Purge Manifest?
            </h3>
            <p className="text-[10px] text-gray-500 mb-8 font-mono tracking-widest uppercase">
              Irreversible removal of transfer: {deleteId}
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

      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
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
            Tracking asset relocation and deployment manifests
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="flex-1 sm:flex-none h-12 rounded-xl border-slate-700/50 hover:bg-slate-500/10 font-black text-[10px] uppercase tracking-widest"
          >
            <Download size={16} className="mr-2" /> Export Manifest
          </Button>
          <Button
            onClick={() => {
              setSelectedTransfer(null);
              setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-none h-12 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 px-8"
          >
            <Plus size={16} className="mr-2" /> New Transfer
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
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
            placeholder="Search manifest ID, asset, or location..."
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
                ? "bg-black/20 border-white/10 text-white focus:border-blue-500/50"
                : "bg-gray-50 border-gray-200 text-gray-700"
            )}
          >
            {statusOptions.map((opt) => (
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

      {/* Main Table */}
      <div
        className={cn(
          "rounded-[2rem] border overflow-hidden",
          isDark
            ? "border-white/5 bg-[#111118]"
            : "bg-white shadow-sm border-gray-100"
        )}
      >
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
                <th className="px-8 py-5">Transit Path</th>
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
                paginated.map((item) => (
                  <tr
                    key={item.id}
                    className={cn(
                      "text-sm transition-colors group",
                      isDark ? "hover:bg-white/[0.02]" : "hover:bg-blue-50/30"
                    )}
                  >
                    <td className="px-8 py-5 font-mono text-[11px] text-blue-500 font-black tracking-tighter uppercase">
                      {item.id}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "font-black",
                            isDark ? "text-gray-200" : "text-gray-900"
                          )}
                        >
                          {item.assetName}
                        </span>
                        <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase font-black tracking-widest mt-1">
                          <span>{item.fromLocation}</span>
                          <ArrowRightLeft size={10} className="text-blue-500" />
                          <span
                            className={
                              isDark ? "text-gray-400" : "text-gray-700"
                            }
                          >
                            {item.toLocation}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                          item.status === "Completed"
                            ? "bg-green-500/10 text-green-500"
                            : item.status === "In Transit"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-orange-500/10 text-orange-500"
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-blue-500"
                          onClick={() => setViewingTransfer(item)}
                        >
                          <SquareArrowOutUpLeft size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-blue-500"
                          onClick={() => {
                            setSelectedTransfer(item);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-red-500"
                          onClick={() => setDeleteId(item.id)}
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
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                      No matching logistics records found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW */}
        <div className="md:hidden divide-y divide-white/5">
          {paginated.map((item) => (
            <div key={item.id} className="p-6 flex flex-col gap-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-[10px] text-blue-500 font-black tracking-tighter uppercase mb-1">
                    {item.id}
                  </p>
                  <h4
                    className={cn(
                      "font-black text-lg",
                      isDark ? "text-white" : "text-gray-900"
                    )}
                  >
                    {item.assetName}
                  </h4>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                    {item.fromLocation} → {item.toLocation}
                  </p>
                </div>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                    item.status === "Completed"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-blue-500/10 text-blue-500"
                  )}
                >
                  {item.status}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-11 border-white/10 text-[9px] uppercase font-black tracking-widest"
                  onClick={() => setViewingTransfer(item)}
                >
                  Details
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-11 border-white/10 text-[9px] uppercase font-black tracking-widest"
                  onClick={() => {
                    setSelectedTransfer(item);
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 text-red-500/50"
                  onClick={() => setDeleteId(item.id)}
                >
                  <Trash2 size={16} />
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
            TOTAL MANIFESTS: {filteredTransfers.length}
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

      {/* Detail Side Drawer */}
      {viewingTransfer && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in"
            onClick={() => setViewingTransfer(null)}
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
              onClick={() => setViewingTransfer(null)}
              className="absolute top-8 right-8 text-slate-500 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
            <header className="mb-12 pt-6">
              <span className="px-4 py-1.5 rounded-full text-[9px] font-black border border-blue-500/50 text-blue-500 mb-6 inline-block uppercase tracking-[0.2em]">
                Logistics Manifest
              </span>
              <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tighter uppercase">
                {viewingTransfer.assetName}
              </h2>
              <p className="font-mono text-blue-500 text-sm font-black tracking-[0.1em] uppercase opacity-80">
                {viewingTransfer.id}
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
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                  <MapPin size={16} /> Transit Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 text-sm">
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      Source Location
                    </p>
                    <p className="font-black text-lg">
                      {viewingTransfer.fromLocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      Destination
                    </p>
                    <p className="font-black text-lg">
                      {viewingTransfer.toLocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      Transport Status
                    </p>
                    <p className="font-black text-lg uppercase text-blue-500">
                      {viewingTransfer.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      Dispatch Date
                    </p>
                    <p className="font-mono font-black">
                      {viewingTransfer.date}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700 font-black text-[10px] uppercase tracking-[0.2em] h-14 rounded-2xl shadow-xl shadow-blue-900/20">
                  <ShieldCheck size={18} className="mr-3" /> Verify Waybill
                  Manifest
                </Button>
                <p className="text-[9px] text-center text-gray-500 font-black uppercase tracking-widest italic">
                  Electronic chain of custody logged
                </p>
              </div>
            </section>
          </aside>
        </div>
      )}

      <TransfersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedTransfer}
        isDark={isDark}
      />
    </Layout>
  );
};

export default Transfers;
