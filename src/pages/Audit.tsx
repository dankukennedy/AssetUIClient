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
  Monitor,
  CheckCircle2,
  SquareArrowOutUpLeft,
  ShieldCheck,
  Download,
  AlertOctagon,
  Loader2,
  Filter,
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";
import { AuditModal, type Audit } from "../models/AuditModal";
import { TransfersModal } from "../models/TransfersModal";

const AuditPage = () => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedAlloc, setSelectedAlloc] = useState<Audit | null>(null);
  const [viewingAlloc, setViewingAlloc] = useState<Audit | null>(null);

  // Revocation States
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  // Toast States
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", sub: "" });

  const itemsPerPage = 6;

  // Mock Data
  const [audits, setAudits] = useState<Audit[]>([
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

  // FIXED: Corrected mapping property from a.audit to a.department
  const departments = useMemo(() => {
    const depts = new Set(audits.map((a) => a.department));
    return ["All Departments", ...Array.from(depts)];
  }, [audits]);

  const triggerToast = (title: string, sub: string) => {
    setToastMessage({ title, sub });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // --- Handlers ---
  const handleSave = (data: Audit) => {
    // FIXED: selectedAudit was undefined, changed to selectedAlloc
    if (selectedAlloc) {
      setAudits(audits.map((a) => (a.id === selectedAlloc.id ? data : a)));
      triggerToast("Assignment Updated", "Personnel records synchronized");
    } else {
      setAudits([data, ...audits]);
      triggerToast("New Allocation Created", "Resource successfully assigned");
    }
    setIsModalOpen(false);
  };

  const confirmRevocation = async () => {
    if (!revokingId) return;
    setIsRevoking(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setAudits(audits.filter((a) => a.id !== revokingId));
    triggerToast("Assignment Revoked", `Asset ${revokingId} returned to pool`);

    setRevokingId(null);
    setIsRevoking(false);
    if (viewingAlloc?.id === revokingId) setViewingAlloc(null);
  };

  const downloadCSV = () => {
    const headers = [
      "Audit ID",
      "User Name",
      "User ID",
      "Asset Name",
      "Asset ID",
      "Department",
      "Date",
    ];
    const csvContent = [
      headers.join(","),
      ...audits.map((a) =>
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
      `audits_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Export Successful", "Allocation logs saved to CSV");
  };

  // --- Search & Filtering ---
  const filteredAudits = useMemo(() => {
    return audits.filter((a) => {
      const matchesSearch =
        a.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept =
        selectedDept === "All Departments" || a.department === selectedDept;
      return matchesSearch && matchesDept;
    });
  }, [searchTerm, selectedDept, audits]);

  const totalPages = Math.ceil(filteredAudits.length / itemsPerPage);
  const paginated = filteredAudits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout title="Resource Assignment" icon={UserCheck}>
      {/* 1. REVOCATION MODAL */}
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
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertOctagon className="text-amber-500" size={32} />
            </div>
            <h3 className="text-xl font-black mb-2 tracking-tighter uppercase text-amber-500">
              Revoke Assignment?
            </h3>
            <p className="text-[10px] text-gray-500 mb-8 font-mono tracking-widest uppercase">
              REMOVING ACCESS FOR RECORD: {revokingId}
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
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
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

      {/* 2. TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[2000] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={cn(
              "flex items-center gap-4 px-8 py-5 rounded-[2rem] shadow-2xl border backdrop-blur-md",
              isDark
                ? "bg-[#111118]/90 border-emerald-500/50 text-emerald-400"
                : "bg-white/90 border-emerald-100 text-emerald-600"
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

      {/* 3. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2
            className={cn(
              "text-2xl font-black tracking-tight uppercase",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            Asset Allocation
          </h2>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest italic">
            Managing hardware distribution across personnel
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="h-12 rounded-xl border-slate-700/50 font-black text-[10px] uppercase tracking-widest"
          >
            <Download size={16} className="mr-2" /> Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsTransferOpen(true)}
            className="h-12 rounded-xl border-slate-700/50 font-black text-[10px] uppercase tracking-widest"
          >
            <ArrowRightLeft size={16} className="mr-2" /> Quick Transfer
          </Button>
          <Button
            onClick={() => {
              setSelectedAlloc(null);
              setIsModalOpen(true);
            }}
            className="h-12 rounded-xl bg-blue-600 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20"
          >
            <Plus size={16} className="mr-2" /> New Assignment
          </Button>
        </div>
      </div>

      {/* 4. SEARCH & FILTER */}
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
            placeholder="Search assignee, asset, or department..."
            className={cn(
              "w-full pl-12 pr-4 py-3 rounded-xl text-sm outline-none transition-all",
              isDark ? "bg-black/20 text-white" : "bg-gray-50"
            )}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <select
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setCurrentPage(1);
            }}
            className={cn(
              "w-full pl-10 pr-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest appearance-none outline-none cursor-pointer",
              isDark ? "bg-black/20 text-white" : "bg-gray-50 text-gray-700"
            )}
          >
            {departments.map((dept) => (
              <option
                key={dept}
                value={dept}
                className={isDark ? "bg-[#0d0d12]" : "bg-white"}
              >
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5. TABLE */}
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
                <th className="px-8 py-5">Assignee Details</th>
                <th className="px-8 py-5">Hardware Profile</th>
                <th className="px-8 py-5">Manifest Date</th>
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
                paginated.map((a) => (
                  <tr
                    key={a.id}
                    className={cn(
                      "text-sm transition-colors group",
                      isDark ? "hover:bg-white/[0.02]" : "hover:bg-blue-50/30"
                    )}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-black text-xs">
                          {a.userName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={cn(
                              "font-black uppercase tracking-tight",
                              isDark ? "text-gray-200" : "text-gray-900"
                            )}
                          >
                            {a.userName}
                          </span>
                          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                            {a.department}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "font-black",
                            isDark ? "text-gray-200" : "text-gray-900"
                          )}
                        >
                          {a.assetName}
                        </span>
                        <span className="font-mono text-[10px] text-blue-500 font-black uppercase">
                          {a.assetId}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-mono text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                      {a.date}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => setViewingAlloc(a)}
                        >
                          <SquareArrowOutUpLeft size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
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
                          className="h-9 w-9 hover:text-red-500"
                          onClick={() => setRevokingId(a.id)}
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
                    className="px-8 py-20 text-center font-mono text-xs text-gray-500 uppercase tracking-widest"
                  >
                    No matching assignments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 6. PAGINATION */}
        <div
          className={cn(
            "px-8 py-5 flex items-center justify-between border-t",
            isDark
              ? "border-white/5 bg-white/5"
              : "border-gray-100 bg-gray-50/30"
          )}
        >
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest italic">
            ACTIVE ASSIGNMENTS: {filteredAudits.length}
          </span>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
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
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* 7. SIDE DRAWER */}
      {viewingAlloc && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setViewingAlloc(null)}
          />
          <aside
            className={cn(
              "relative w-full max-w-lg h-full p-12 shadow-2xl border-l animate-in slide-in-from-right",
              isDark
                ? "bg-[#0d0d12] text-white border-white/10"
                : "bg-white text-gray-900 border-gray-200"
            )}
          >
            <button
              onClick={() => setViewingAlloc(null)}
              className="absolute top-8 right-8 text-slate-500 hover:text-red-500"
            >
              <X size={24} />
            </button>
            <header className="mb-12 pt-6">
              <span className="px-4 py-1.5 rounded-full text-[9px] font-black border border-blue-500/50 text-blue-500 mb-6 inline-block uppercase tracking-[0.2em]">
                Assignment Profile
              </span>
              <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase">
                {viewingAlloc.userName}
              </h2>
              <p className="font-mono text-blue-500 text-sm font-black uppercase opacity-80">
                {viewingAlloc.userId}
              </p>
            </header>
            <section className="space-y-8">
              <div
                className={cn(
                  "rounded-3xl p-8 border",
                  isDark
                    ? "bg-white/5 border-white/5"
                    : "bg-gray-50 border-gray-100"
                )}
              >
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                  <Monitor size={16} /> Allocated Hardware
                </h3>
                <div className="grid grid-cols-2 gap-y-10 text-sm">
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] mb-2">
                      Asset Descriptor
                    </p>
                    <p className="font-black text-lg">
                      {viewingAlloc.assetName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] mb-2">
                      System Serial
                    </p>
                    <p className="font-mono text-blue-500 font-black text-lg uppercase">
                      {viewingAlloc.assetId}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] mb-2">
                      Cost Center
                    </p>
                    <p className="font-black">{viewingAlloc.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] mb-2">
                      Handover Date
                    </p>
                    <p className="font-mono font-black">{viewingAlloc.date}</p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 font-black text-[10px] uppercase h-14 rounded-2xl">
                <ShieldCheck size={18} className="mr-3" /> Generate Handover
                Form
              </Button>
            </section>
          </aside>
        </div>
      )}

      {/* 8. MODALS */}
      <AuditModal
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

export default AuditPage;
