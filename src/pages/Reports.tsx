import React, { useState, useMemo } from "react";
import { Layout } from "../component/Layout";
import {
  BarChart3,
  Download,
  Zap,
  CheckCircle2,
  Trash2,
  Clock,
  ShieldCheck,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  AlertOctagon,
  Loader2,
  SquareArrowOutUpLeft,
  Database,
  Plus,
  Filter,
  Activity,
  FileSpreadsheet,
  Monitor,
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";
import { ReportsModal } from "../models/ReportsModal";

interface Report {
  id: string;
  title: string;
  date: string;
  type: "PDF" | "CSV" | "JSON";
  size: string;
}

const Reports = () => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState<Report | null>(null);

  // Custom Purge States
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", sub: "" });

  const itemsPerPage = 6;

  const [reports, setReports] = useState<Report[]>([
    {
      id: "REP-001",
      title: "Q1 Asset Depreciation",
      date: "2024-03-01",
      type: "PDF",
      size: "2.4 MB",
    },
    {
      id: "REP-002",
      title: "Security Audit Log",
      date: "2024-03-05",
      type: "CSV",
      size: "842 KB",
    },
    {
      id: "REP-003",
      title: "Hardware Lifecycle Summary",
      date: "2024-03-10",
      type: "PDF",
      size: "4.1 MB",
    },
  ]);

  // Derived unique types for filter
  const typeOptions = useMemo(() => {
    return ["All", "PDF", "CSV", "JSON"];
  }, []);

  // --- Logic: Trigger Toast ---
  const triggerToast = (title: string, sub: string) => {
    setToastMessage({ title, sub });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // --- Handlers ---
  const triggerReportGeneration = (data: any) => {
    setIsModalOpen(false);
    setIsCompiling(true);
    setCompileProgress(0);

    const interval = setInterval(() => {
      setCompileProgress((prev) =>
        prev >= 100 ? (clearInterval(interval), 100) : prev + 5
      );
    }, 100);

    setTimeout(() => {
      const newReport: Report = {
        id: `REP-00${reports.length + 1}`,
        title: data.title || "New System Analysis",
        date: new Date().toISOString().split("T")[0],
        type: data.type || "PDF",
        size: `${(Math.random() * 5).toFixed(1)} MB`,
      };
      setReports([newReport, ...reports]);
      setIsCompiling(false);
      triggerToast(
        "Generation Complete",
        "Intel manifest committed to core registry"
      );
    }, 2200);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setReports(reports.filter((r) => r.id !== deleteId));
    triggerToast("Record Purged", `Report ${deleteId} removed from registry`);

    setDeleteId(null);
    setIsDeleting(false);
    if (viewingReport?.id === deleteId) setViewingReport(null);
  };

  const downloadCSV = () => {
    const headers = ["ID", "Title", "Date", "Format", "Size"];
    const csvContent = [
      headers.join(","),
      ...reports.map((r) =>
        [r.id, `"${r.title}"`, r.date, r.type, r.size].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `intel_report_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Data Exported", "Intel registry saved as CSV");
  };

  // --- Logic: Search & Pagination ---
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "All" || r.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [searchTerm, typeFilter, reports]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginated = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout title="Analytics Hub" icon={BarChart3}>
      {/* GLOBAL OVERLAYS: Compilation Progress */}
      {isCompiling && (
        <div className="fixed top-0 left-0 w-full h-1 z-[2000] bg-blue-500/10">
          <div
            className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all duration-150"
            style={{ width: `${compileProgress}%` }}
          />
        </div>
      )}

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
              Purge Report?
            </h3>
            <p className="text-[10px] text-gray-500 mb-8 font-mono tracking-widest uppercase">
              Permanently removing report: {deleteId}
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
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Activity className="text-blue-500" size={20} />
            </div>
            <h2
              className={cn(
                "text-2xl font-black tracking-tight uppercase",
                isDark ? "text-white" : "text-gray-900"
              )}
            >
              Intelligence <span className="text-blue-500">Registry</span>
            </h2>
          </div>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            Strategic Data Compilation & Asset Compliance
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="flex-1 sm:flex-none h-12 rounded-xl border-slate-700/50 hover:bg-slate-500/10 font-black text-[10px] uppercase tracking-widest"
          >
            <FileSpreadsheet size={16} className="mr-2" /> Export Dataset
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none h-12 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20"
          >
            <Plus size={16} className="mr-2" /> Create Report
          </Button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Data Nodes",
            val: "1,204",
            icon: Database,
            color: "text-blue-500",
            bg: "bg-blue-500/5",
          },
          {
            label: "Sync Status",
            val: "Optimal",
            icon: Zap,
            color: "text-emerald-500",
            bg: "bg-emerald-500/5",
          },
          {
            label: "Compliance",
            val: "98.2%",
            icon: ShieldCheck,
            color: "text-purple-500",
            bg: "bg-purple-500/5",
          },
          {
            label: "Latency",
            val: "14ms",
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-500/5",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={cn(
              "p-6 rounded-[2rem] border transition-all hover:border-blue-500/30",
              isDark
                ? "bg-[#0d0d12] border-white/5"
                : "bg-white border-slate-100 shadow-sm"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mb-4",
                stat.bg
              )}
            >
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">
              {stat.label}
            </p>
            <p
              className={cn(
                "text-xl font-black tracking-tighter",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              {stat.val}
            </p>
          </div>
        ))}
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
            placeholder="Search report index by title or ID..."
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
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={cn(
              "w-full pl-10 pr-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer",
              isDark
                ? "bg-black/20 border-white/10 text-white focus:border-blue-500/50"
                : "bg-gray-50 border-gray-200 text-gray-700"
            )}
          >
            {typeOptions.map((opt) => (
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

      {/* Main Content Area */}
      <div
        className={cn(
          "rounded-[2rem] border overflow-hidden",
          isDark
            ? "border-white/5 bg-[#111118]"
            : "bg-white shadow-sm border-gray-100"
        )}
      >
        {/* DESKTOP VIEW: Table */}
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
                <th className="px-8 py-5">Intel ID</th>
                <th className="px-8 py-5">Analysis Profile</th>
                <th className="px-8 py-5">Format</th>
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
                paginated.map((report) => (
                  <tr
                    key={report.id}
                    className={cn(
                      "text-sm transition-colors group",
                      isDark ? "hover:bg-white/[0.02]" : "hover:bg-blue-50/30"
                    )}
                  >
                    <td className="px-8 py-5 font-mono text-[11px] text-blue-500 font-black tracking-tighter uppercase">
                      {report.id}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "font-black",
                            isDark ? "text-gray-200" : "text-gray-900"
                          )}
                        >
                          {report.title}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                          {report.date} • {report.size}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                          report.type === "PDF"
                            ? "bg-red-500/10 text-red-500"
                            : report.type === "CSV"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-blue-500/10 text-blue-500"
                        )}
                      >
                        {report.type}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-blue-500"
                          onClick={() => setViewingReport(report)}
                        >
                          <SquareArrowOutUpLeft size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-blue-500"
                          onClick={() =>
                            triggerToast(
                              "Download Initiated",
                              "Retrieving secure document..."
                            )
                          }
                        >
                          <Download size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-gray-400 hover:text-red-500"
                          onClick={() => setDeleteId(report.id)}
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
                      No matching intelligence records found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW: Card Stack */}
        <div className="md:hidden divide-y divide-white/5">
          {paginated.length > 0 ? (
            paginated.map((report) => (
              <div key={report.id} className="p-6 flex flex-col gap-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono text-[10px] text-blue-500 font-black tracking-tighter uppercase mb-1">
                      {report.id}
                    </p>
                    <h4
                      className={cn(
                        "font-black text-lg",
                        isDark ? "text-white" : "text-gray-900"
                      )}
                    >
                      {report.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                      {report.date} • {report.size}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      report.type === "PDF"
                        ? "bg-red-500/10 text-red-500"
                        : report.type === "CSV"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-blue-500/10 text-blue-500"
                    )}
                  >
                    {report.type}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 h-11 border-white/10 text-[9px] uppercase font-black tracking-widest"
                    onClick={() => setViewingReport(report)}
                  >
                    Inspect
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-11 border-white/10 text-[9px] uppercase font-black tracking-widest"
                    onClick={() =>
                      triggerToast(
                        "Download Initiated",
                        "Retrieving secure document..."
                      )
                    }
                  >
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 text-red-500/50 hover:text-red-500"
                    onClick={() => setDeleteId(report.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                No matching hardware records
              </p>
            </div>
          )}
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
            TOTAL RECORDS: {filteredReports.length}
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
      {viewingReport && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in"
            onClick={() => setViewingReport(null)}
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
              onClick={() => setViewingReport(null)}
              className="absolute top-8 right-8 text-slate-500 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
            <header className="mb-12 pt-6">
              <span className="px-4 py-1.5 rounded-full text-[9px] font-black border border-blue-500/50 text-blue-500 mb-6 inline-block uppercase tracking-[0.2em]">
                Intel Report Analysis
              </span>
              <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tighter uppercase">
                {viewingReport.title}
              </h2>
              <p className="font-mono text-blue-500 text-sm font-black tracking-[0.1em] uppercase opacity-80">
                {viewingReport.id}
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
                  <Monitor size={16} /> Technical Metadata
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 text-sm">
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      File Format
                    </p>
                    <p className="font-black text-lg">{viewingReport.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      Payload Size
                    </p>
                    <p className="font-black text-lg uppercase tracking-tight text-blue-500">
                      {viewingReport.size}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      Generation Date
                    </p>
                    <p className="font-black tracking-tight">
                      {viewingReport.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.2em] mb-2">
                      Security Level
                    </p>
                    <p className="font-mono font-black text-emerald-500">
                      ENCRYPTED
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                <Button
                  className="w-full justify-center bg-blue-600 hover:bg-blue-700 font-black text-[10px] uppercase tracking-[0.2em] h-14 rounded-2xl shadow-xl shadow-blue-900/20"
                  onClick={() =>
                    triggerToast(
                      "Download Initiated",
                      "Retrieving secure document..."
                    )
                  }
                >
                  <Download size={18} className="mr-3" /> Download Document
                </Button>
                <p className="text-[9px] text-center text-gray-500 font-black uppercase tracking-widest italic">
                  Data access is logged per security protocol v4.0
                </p>
              </div>
            </section>
          </aside>
        </div>
      )}

      {/* Reports Modal */}
      <ReportsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={triggerReportGeneration}
        isDark={isDark}
      />
    </Layout>
  );
};

export default Reports;
