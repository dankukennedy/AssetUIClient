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
  AlertTriangle,
  Loader2,
  SquareArrowOutUpLeft,
  Calendar,
  Database,
  Plus,
  Filter,
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";
import { ReportsModal } from "../models/ReportsModal";

// --- Types ---
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

  // Simulation States
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMeta, setToastMeta] = useState({ title: "", sub: "" });

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

  // --- Logic: Feedback Systems ---
  const triggerToast = (title: string, sub: string) => {
    setToastMeta({ title, sub });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const triggerReportGeneration = (data: any) => {
    setIsModalOpen(false);
    setIsCompiling(true);
    setCompileProgress(0);

    const interval = setInterval(() => {
      setCompileProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
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
    await new Promise((r) => setTimeout(r, 800));
    setReports(reports.filter((r) => r.id !== deleteId));
    triggerToast("Report Purged", `Manifest ${deleteId} removed from disk`);
    setDeleteId(null);
    setIsDeleting(false);
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
    link.setAttribute("download", `intel_archive_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Archive Exported", "Intel registry saved as CSV");
  };

  // --- Logic: Filtering & Pagination ---
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
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout title="Analytics Hub" icon={BarChart3}>
      {/* HUD: Compilation Overlay */}
      {isCompiling && (
        <div className="fixed top-0 left-0 w-full h-1.5 z-[2000] bg-blue-500/10">
          <div
            className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-100 ease-out"
            style={{ width: `${compileProgress}%` }}
          />
          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-blue-500/30 px-8 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-pulse">
            <Loader2 className="animate-spin text-blue-500" size={16} />
            <span className="text-[10px] font-black uppercase text-blue-400 tracking-[0.3em]">
              Compiling Intelligence Manifest... {compileProgress}%
            </span>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div
            className={cn(
              "p-10 rounded-[3rem] border max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200",
              isDark
                ? "bg-[#0d0d12] border-red-500/20"
                : "bg-white border-gray-100"
            )}
          >
            <AlertTriangle className="text-red-500 mx-auto mb-6" size={48} />
            <h3 className="text-xl font-black mb-2 uppercase text-red-500 tracking-tighter">
              Purge Data?
            </h3>
            <p className="text-[10px] text-gray-500 mb-8 font-mono tracking-widest uppercase">
              Registry ID: {deleteId}
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
                  "Confirm Purge"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[1500] animate-in slide-in-from-right-10 fade-in">
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
                {toastMeta.title}
              </span>
              <span className="text-[10px] opacity-70 uppercase font-bold tracking-[0.2em]">
                {toastMeta.sub}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2
            className={cn(
              "text-4xl font-black tracking-tighter uppercase",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            System Intel
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest font-bold">
              Registry Live / Lifecycle Compliance Active
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="h-14 rounded-2xl border-white/10 px-6 font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            <Download size={16} className="mr-3" /> Export Archive
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white px-8 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/40 transition-all active:scale-95"
          >
            <Zap size={16} className="mr-3 fill-current" /> Generate Manifest
          </Button>
        </div>
      </div>

      {/* Statistics HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          {
            label: "Storage Nodes",
            val: "1,204",
            icon: Database,
            color: "text-blue-500",
          },
          {
            label: "Integrity Rate",
            val: "99.98%",
            icon: ShieldCheck,
            color: "text-emerald-500",
          },
          {
            label: "Sync Latency",
            val: "14ms",
            icon: Clock,
            color: "text-purple-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={cn(
              "p-8 rounded-[2rem] border relative overflow-hidden group",
              isDark
                ? "bg-[#111118] border-white/5"
                : "bg-white border-gray-100 shadow-sm"
            )}
          >
            <div className="relative z-10">
              <p className="text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] mb-2">
                {stat.label}
              </p>
              <p
                className={cn(
                  "text-4xl font-black tracking-tighter",
                  stat.color
                )}
              >
                {stat.val}
              </p>
            </div>
            <stat.icon
              size={80}
              className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {/* Toolbar with New Report Button */}
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
              placeholder="Search manifest by title or registry ID..."
              className={cn(
                "w-full pl-14 pr-6 py-4 rounded-2xl text-sm outline-none transition-all font-medium",
                isDark
                  ? "bg-black/40 border-white/10 text-white focus:border-blue-500/50"
                  : "bg-gray-50 border-gray-200"
              )}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            variant="ghost"
            className={cn(
              "h-14 px-6 rounded-2xl border border-dashed font-black text-[10px] uppercase tracking-widest transition-all hidden lg:flex",
              isDark
                ? "border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/60"
                : "border-blue-200 text-blue-600 hover:bg-blue-50"
            )}
          >
            <Plus size={16} className="mr-2" />
            New Report
          </Button>
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Intelligence Formats</option>
            <option value="PDF">Format: PDF (Portable)</option>
            <option value="CSV">Format: CSV (Data)</option>
            <option value="JSON">Format: JSON (Object)</option>
          </select>
        </div>
      </div>

      {/* Registry Table */}
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
                <th className="px-10 py-6">Intelligence Identity</th>
                <th className="px-10 py-6 text-center">Format Cluster</th>
                <th className="px-10 py-6 text-right">Registry Operations</th>
              </tr>
            </thead>
            <tbody
              className={cn(
                "divide-y",
                isDark ? "divide-white/5" : "divide-gray-50"
              )}
            >
              {paginatedReports.map((report) => (
                <tr
                  key={report.id}
                  className={cn(
                    "text-sm transition-all group",
                    isDark ? "hover:bg-blue-500/[0.03]" : "hover:bg-blue-50/50"
                  )}
                >
                  <td className="px-10 py-7">
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "font-black text-lg tracking-tight mb-1",
                          isDark ? "text-gray-200" : "text-gray-900"
                        )}
                      >
                        {report.title}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-blue-500 font-black tracking-tighter uppercase">
                          {report.id}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-700" />
                        <span className="font-mono text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          {report.date}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-7 text-center">
                    <span className="px-4 py-2 rounded-xl text-[9px] font-black border border-blue-500/20 text-blue-500 bg-blue-500/5 uppercase tracking-[0.2em]">
                      {report.type} // {report.size}
                    </span>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-xl text-gray-500 hover:text-blue-500 hover:bg-blue-500/10"
                        onClick={() => setViewingReport(report)}
                      >
                        <SquareArrowOutUpLeft size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                        onClick={() => setDeleteId(report.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginator HUD */}
        <div
          className={cn(
            "px-10 py-6 flex items-center justify-between border-t",
            isDark
              ? "border-white/5 bg-white/[0.02]"
              : "border-gray-100 bg-gray-50/50"
          )}
        >
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest italic">
              {filteredReports.length} Encrypted Records Found
            </span>
          </div>
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

      {/* Sub-Components: Side Drawer Detail */}
      {viewingReport && (
        <div className="fixed inset-0 z-[1600] flex justify-end">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in"
            onClick={() => setViewingReport(null)}
          />
          <aside
            className={cn(
              "relative w-full max-w-lg h-full p-16 shadow-2xl animate-in slide-in-from-right duration-500 border-l",
              isDark
                ? "bg-[#0d0d12] border-white/10 text-white"
                : "bg-white border-gray-200"
            )}
          >
            <button
              onClick={() => setViewingReport(null)}
              className="absolute top-10 right-10 text-slate-500 hover:text-red-500 transition-colors"
            >
              <X size={32} />
            </button>
            <header className="mb-16 pt-10">
              <span className="px-5 py-2 rounded-full text-[10px] font-black border border-blue-500/40 text-blue-500 mb-8 inline-block uppercase tracking-[0.3em]">
                Registry Detail
              </span>
              <h2 className="text-5xl font-black mb-4 tracking-tighter uppercase leading-[0.9]">
                {viewingReport.title}
              </h2>
              <p className="font-mono text-blue-500 text-lg font-black tracking-widest uppercase opacity-80">
                {viewingReport.id}
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
              <h3 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                <Database size={20} /> Manifest Properties
              </h3>
              <div className="space-y-10">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 font-black uppercase text-[10px] tracking-[0.2em] mb-2">
                      Committed On
                    </p>
                    <p className="font-black flex items-center gap-3 text-xl">
                      <Calendar size={20} className="text-blue-500" />{" "}
                      {viewingReport.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 font-black uppercase text-[10px] tracking-[0.2em] mb-2">
                      Binary Weight
                    </p>
                    <p className="font-mono font-black text-xl text-blue-500">
                      {viewingReport.size}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-black text-[12px] uppercase tracking-[0.3em] h-20 rounded-[2rem] shadow-2xl shadow-blue-900/40 transition-all active:scale-95">
              <Download size={20} className="mr-4" /> Pull From Registry
            </Button>
          </aside>
        </div>
      )}

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
