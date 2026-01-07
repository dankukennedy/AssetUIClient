import React, { useState, useMemo } from "react";
import { Layout } from "../component/Layout";
import {
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  Search,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Monitor,
  CheckCircle2,
  SquareArrowOutUpLeft,
  ShieldCheck,
  Download,
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";
import { AllocationModal, type Allocation } from "../models/AllocationsModal";
import { TransfersModal } from "../models/TransfersModal";

const AllocationManagement = () => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedAlloc, setSelectedAlloc] = useState<Allocation | null>(null);
  const [viewingAlloc, setViewingAlloc] = useState<Allocation | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", sub: "" });

  const itemsPerPage = 5;

  const [allocations, setAllocations] = useState<Allocation[]>([
    {
      id: "ALC-101",
      assetId: "AST-001",
      assetName: "MacBook Pro",
      userId: "USR-01",
      userName: "Edem Quist",
      date: "2023-11-05",
      department: "Engineering",
    },
    {
      id: "ALC-102",
      assetId: "AST-003",
      assetName: "iPhone 15",
      userId: "USR-09",
      userName: "Sarah Smith",
      date: "2024-01-12",
      department: "Marketing",
    },
  ]);

  // --- Handlers ---
  const handleSave = (data: Allocation) => {
    if (selectedAlloc) {
      // Update existing
      setAllocations(
        allocations.map((a) => (a.id === selectedAlloc.id ? data : a))
      );
      setToastMessage({
        title: "Assignment Updated",
        sub: "Personnel records synchronized",
      });
    } else {
      // Create new
      setAllocations([data, ...allocations]);
      setToastMessage({
        title: "New Allocation Created",
        sub: "Resource successfully assigned",
      });
    }
    setIsModalOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to revoke this assignment? The asset will return to unallocated status."
      )
    ) {
      setAllocations(allocations.filter((a) => a.id !== id));
      setToastMessage({
        title: "Assignment Revoked",
        sub: "Asset record updated",
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const downloadCSV = () => {
    const headers = [
      "Allocation ID",
      "User Name",
      "User ID",
      "Asset Name",
      "Asset ID",
      "Department",
      "Date",
    ];
    const csvContent = [
      headers.join(","),
      ...allocations.map((a) =>
        [
          a.id,
          `"${a.userName}"`,
          a.userId,
          `"${a.assetName}"`,
          a.assetId,
          a.department,
          a.date,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `allocations_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage({
      title: "Export Successful",
      sub: "Allocation logs saved to CSV",
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // --- Logic: Search & Pagination ---
  const filteredAllocations = useMemo(() => {
    return allocations.filter(
      (a) =>
        a.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.assetId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allocations]);

  const totalPages = Math.ceil(filteredAllocations.length / itemsPerPage);
  const paginated = filteredAllocations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout title="Resource Assignment" icon={UserCheck}>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[400] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={cn(
              "flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border",
              isDark
                ? "bg-[#111118] border-emerald-500/50 text-emerald-400"
                : "bg-white border-emerald-100 text-emerald-600"
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2
            className={cn(
              "text-2xl font-black tracking-tight",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            Asset Allocation
          </h2>
          <p className="text-sm text-gray-500">
            Managing hardware distribution across personnel
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
            variant="outline"
            onClick={() => setIsTransferOpen(true)}
            className="border-slate-700/50"
          >
            <ArrowRightLeft size={18} className="mr-2" /> Quick Transfer
          </Button>
          <Button
            onClick={() => {
              setSelectedAlloc(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={18} className="mr-2" /> New Assignment
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div
        className={cn(
          "p-4 rounded-xl mb-6 shadow-sm",
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
            placeholder="Search assignee or asset..."
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

      {/* Table */}
      <div
        className={cn(
          "rounded-xl border overflow-hidden",
          isDark ? "border-white/5 bg-[#111118]" : "bg-white shadow-sm"
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr
                className={cn(
                  "text-[10px] uppercase tracking-widest font-black",
                  isDark
                    ? "bg-white/5 text-gray-400"
                    : "bg-gray-50 text-gray-500"
                )}
              >
                <th className="px-6 py-4">Assignee</th>
                <th className="px-6 py-4">Asset Detail</th>
                <th className="px-6 py-4">Date Assigned</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className={cn(
                "divide-y",
                isDark ? "divide-white/5" : "divide-gray-50"
              )}
            >
              {paginated.map((a) => (
                <tr
                  key={a.id}
                  className={cn(
                    "text-sm transition-colors",
                    isDark ? "hover:bg-white/5" : "hover:bg-blue-50/50"
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <User size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "font-bold",
                            isDark ? "text-gray-200" : "text-gray-700"
                          )}
                        >
                          {a.userName}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase font-black">
                          {a.department}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "font-bold",
                          isDark ? "text-gray-200" : "text-gray-700"
                        )}
                      >
                        {a.assetName}
                      </span>
                      <span className="font-mono text-[10px] text-blue-500 font-bold">
                        {a.assetId}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                    {a.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-yellow-500"
                        onClick={() => setViewingAlloc(a)}
                      >
                        <SquareArrowOutUpLeft size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-500"
                        onClick={() => {
                          setSelectedAlloc(a);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(a.id)}
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
            ASSIGNMENTS: {filteredAllocations.length}
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
      {viewingAlloc && (
        <div className="fixed inset-0 z-[300] flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setViewingAlloc(null)}
          />
          <aside
            className={cn(
              "relative w-full max-w-lg h-full p-10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-300 overflow-y-auto border-l",
              isDark
                ? "bg-[#0d0d12] border-white/10 text-white"
                : "bg-white border-gray-200 text-gray-900"
            )}
          >
            <button
              onClick={() => setViewingAlloc(null)}
              className="absolute top-6 right-6 text-slate-500 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
            <header className="mb-10">
              <span className="px-3 py-1 rounded-lg text-[10px] font-black border border-blue-500/50 text-blue-500 mb-4 inline-block uppercase tracking-widest">
                Assignment Record
              </span>
              <h2 className="text-4xl font-black mb-2 tracking-tighter">
                {viewingAlloc.userName}
              </h2>
              <p className="font-mono text-blue-500 text-sm font-bold uppercase tracking-widest">
                {viewingAlloc.userId}
              </p>
            </header>
            <section className="space-y-6">
              <div
                className={cn(
                  "rounded-2xl p-6 border",
                  isDark
                    ? "bg-white/5 border-white/5"
                    : "bg-gray-50 border-gray-100"
                )}
              >
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Monitor size={14} /> Allocated Hardware
                </h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm font-mono">
                  <div className="text-slate-500 uppercase text-[10px] font-black">
                    Asset Name
                  </div>
                  <div className="font-bold">{viewingAlloc.assetName}</div>
                  <div className="text-slate-500 uppercase text-[10px] font-black">
                    Serial ID
                  </div>
                  <div className="text-blue-500 font-bold">
                    {viewingAlloc.assetId}
                  </div>
                  <div className="text-slate-500 uppercase text-[10px] font-black">
                    Department
                  </div>
                  <div>{viewingAlloc.department}</div>
                </div>
              </div>
              <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
                <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700 font-black text-xs uppercase tracking-widest py-6">
                  <ShieldCheck size={16} className="mr-2" /> Generate Handover
                  Form
                </Button>
              </div>
            </section>
          </aside>
        </div>
      )}

      {/* Modals */}
      <AllocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedAlloc}
        isDark={isDark}
      />
      <TransfersModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onSave={() => setIsTransferOpen(false)}
        isDark={isDark}
      />
    </Layout>
  );
};

export default AllocationManagement;
