import React, { useState } from "react";
import { Layout } from "../component/Layout";
import {
  BarChart3,
  FileText,
  Download,
  Zap,
  CheckCircle2,
  Trash2,
  Clock,
  ShieldCheck,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
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

  // --- Handlers ---
  const handleGenerateReport = (data: any) => {
    // In a real app, 'data' would come from your ReportsModal form
    const newReport: Report = {
      id: `REP-00${reports.length + 1}`,
      title: data.title || "New System Analysis",
      date: new Date().toISOString().split("T")[0],
      type: data.type || "PDF",
      size: "1.2 MB",
    };
    setReports([newReport, ...reports]);
    setIsModalOpen(false);
    triggerToast();
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const deleteReport = (id: string) => {
    setReports(reports.filter((r) => r.id !== id));
  };

  return (
    <Layout title="Analytics Hub" icon={BarChart3}>
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
              <span className="text-sm font-black tracking-tight">
                Report Generated
              </span>
              <span className="text-[10px] opacity-70 uppercase font-black tracking-widest">
                Analytics compiled and ready for download
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
              "text-2xl font-black tracking-tighter uppercase",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            System Intelligence
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Automated asset lifecycle analytics and compliance logs
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 font-black text-[10px] uppercase tracking-widest px-6"
          onClick={() => setIsModalOpen(true)}
        >
          <Zap size={16} className="mr-2 fill-current" /> Generate Report
        </Button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Active Nodes",
            val: "1,204",
            icon: Zap,
            color: "text-blue-500",
          },
          {
            label: "Uptime Rate",
            val: "99.98%",
            icon: Clock,
            color: "text-emerald-500",
          },
          {
            label: "Security Index",
            val: "A+",
            icon: ShieldCheck,
            color: "text-purple-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={cn(
              "p-4 rounded-xl border flex items-center justify-between",
              isDark
                ? "bg-[#111118] border-white/5"
                : "bg-white border-gray-100 shadow-sm"
            )}
          >
            <div>
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                {stat.label}
              </p>
              <p className={cn("text-xl font-black", stat.color)}>{stat.val}</p>
            </div>
            <stat.icon size={20} className="text-gray-600 opacity-20" />
          </div>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className={cn(
              "group p-6 rounded-2xl border transition-all duration-300",
              isDark
                ? "bg-[#111118] border-white/5 hover:border-blue-500/30"
                : "bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200"
            )}
          >
            <div className="flex justify-between items-start mb-6">
              <div
                className={cn(
                  "p-3 rounded-xl transition-colors",
                  isDark
                    ? "bg-white/5 group-hover:bg-blue-500/10"
                    : "bg-blue-50 group-hover:bg-blue-100"
                )}
              >
                <FileText
                  size={24}
                  className={
                    isDark
                      ? "text-gray-400 group-hover:text-blue-500"
                      : "text-blue-600"
                  }
                />
              </div>
              <div className="flex gap-2">
                <span className="text-[9px] font-black bg-blue-500/10 text-blue-500 px-2 py-1 rounded tracking-tighter">
                  {report.type}
                </span>
                <button
                  onClick={() => deleteReport(report.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <h3
              className={cn(
                "font-black text-lg mb-1 leading-tight tracking-tight",
                isDark ? "text-white" : "text-gray-900"
              )}
            >
              {report.title}
            </h3>
            <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500 mb-6">
              <span>GEN: {report.date}</span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span>SIZE: {report.size}</span>
            </div>

            <Button
              variant="outline"
              className={cn(
                "w-full text-[10px] font-black uppercase tracking-[0.15em] border-white/5 transition-all",
                isDark
                  ? "hover:bg-blue-500/10 hover:text-blue-400"
                  : "hover:bg-blue-50 hover:border-blue-200"
              )}
            >
              <Download size={14} className="mr-2" /> Download Data
            </Button>
          </div>
        ))}
      </div>

      <ReportsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleGenerateReport}
        isDark={isDark}
      />
    </Layout>
  );
};

export default Reports;
