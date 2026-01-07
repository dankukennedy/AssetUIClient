import React, { useState } from "react";
import { Layout } from "../component/Layout";
import {
  Plus,
  ShieldX,
  PowerOff,
  Download,
  AlertTriangle,
  Edit2,
  FileSearch,
  X,
  ShieldCheck,
  Calendar,
  UserCheck,
  History,
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";
import {
  DecommissionModal,
  type DecomRecord,
} from "../models/DecommissionModal";
import { useToast } from "../context/ToastContext";

const Decommission = () => {
  const { theme } = useTheme();
  const { toast } = useToast();

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // --- States ---
  const [records, setRecords] = useState<DecomRecord[]>([
    {
      id: "DEC-001",
      assetId: "AST-882",
      reason: "End of Life",
      decommissionDate: "2024-05-12",
      approvedBy: "Admin",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DecomRecord | null>(
    null
  );
  const [viewingRecord, setViewingRecord] = useState<DecomRecord | null>(null);

  // --- Handlers ---
  const handleSave = (data: DecomRecord) => {
    if (selectedRecord) {
      // Update existing record
      setRecords(records.map((r) => (r.id === selectedRecord.id ? data : r)));
      toast(
        "Protocol Updated",
        "Decommissioning parameters modified",
        "success"
      );
    } else {
      // Create new record
      setRecords([data, ...records]);
      toast("Protocol Executed", "Asset marked for decommissioning", "success");
    }
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "WARNING: Removing this record will delete the audit trail for this protocol. Proceed?"
      )
    ) {
      setRecords(records.filter((r) => r.id !== id));
      toast(
        "Audit Purged",
        "Decommissioning record removed from index",
        "warning"
      );
    }
  };

  const downloadCSV = () => {
    try {
      const headers = [
        "Protocol ID",
        "Asset Reference",
        "Reason",
        "Date",
        "Approved By",
      ];
      const csvRows = records.map((r) =>
        [
          r.id,
          r.assetId,
          `"${r.reason}"`,
          r.decommissionDate,
          r.approvedBy,
        ].join(",")
      );

      const blob = new Blob([[headers.join(","), ...csvRows].join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `decommission_audit_${new Date().getTime()}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast("Audit Exported", "CSV file generated successfully", "success");
    } catch (err) {
      toast("Export Failed", "Could not generate audit file", "error");
    }
  };

  return (
    <Layout title="Offline Protocol" icon={PowerOff}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2
            className={cn(
              "text-2xl font-black tracking-tight",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            Asset Decommissioning
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Permanent removal of hardware from active service
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="border-slate-700/50 hover:bg-slate-500/10 font-black text-[10px] uppercase tracking-widest"
          >
            <Download size={16} className="mr-2" /> Export Audit
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20 font-black text-[10px] uppercase tracking-widest px-6"
            onClick={() => {
              setSelectedRecord(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={16} className="mr-2" /> New Protocol
          </Button>
        </div>
      </div>

      {/* Warning Banner */}
      <div
        className={cn(
          "mb-6 p-4 rounded-xl border flex items-center gap-4",
          isDark
            ? "bg-red-500/5 border-red-500/20 text-red-400"
            : "bg-red-50 border-red-100 text-red-700"
        )}
      >
        <AlertTriangle size={20} className="shrink-0" />
        <p className="text-xs font-bold leading-relaxed">
          ATTENTION: Assets processed through this module are flagged for
          permanent removal. Ensure all data wiping procedures are completed
          before finalizing the protocol.
        </p>
      </div>

      {/* Table Section */}
      <div
        className={cn(
          "rounded-xl border overflow-hidden",
          isDark
            ? "bg-[#111118] border-white/5"
            : "bg-white border-gray-100 shadow-sm"
        )}
      >
        <table className="w-full text-left">
          <thead
            className={cn(
              "text-[10px] uppercase font-black tracking-widest",
              isDark ? "bg-white/5 text-gray-400" : "bg-gray-50 text-gray-500"
            )}
          >
            <tr>
              <th className="px-6 py-4">Protocol ID</th>
              <th className="px-6 py-4">Asset Reference</th>
              <th className="px-6 py-4">Decommission Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {records.length > 0 ? (
              records.map((r) => (
                <tr
                  key={r.id}
                  className="text-sm hover:bg-red-500/5 transition-colors group"
                >
                  <td className="px-6 py-4 font-mono text-xs text-red-500 font-bold tracking-tighter">
                    {r.id}
                  </td>
                  <td
                    className={cn(
                      "px-6 py-4 font-black tracking-tight",
                      isDark ? "text-white" : "text-gray-900"
                    )}
                  >
                    {r.assetId}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                    {r.decommissionDate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingRecord(r)}
                        className="text-emerald-500 hover:bg-emerald-500/10 h-8 w-8"
                      >
                        <FileSearch size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedRecord(r);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-500 hover:bg-blue-500/10 h-8 w-8"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(r.id)}
                        className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 h-8 w-8"
                      >
                        <ShieldX size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-500 italic text-sm"
                >
                  No decommission protocols currently on file.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Audit Side Drawer */}
      {viewingRecord && (
        <div className="fixed inset-0 z-[500] flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setViewingRecord(null)}
          />
          <aside
            className={cn(
              "relative w-full max-w-md h-full p-8 shadow-2xl border-l animate-in slide-in-from-right duration-300",
              isDark
                ? "bg-[#0d0d12] border-white/10 text-white"
                : "bg-white border-gray-200"
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setViewingRecord(null)}
            >
              <X size={20} />
            </Button>

            <header className="mt-8 mb-10">
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <ShieldCheck size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Verified Offline
                </span>
              </div>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                {viewingRecord.id}
              </h2>
              <p className="text-gray-500 font-mono text-sm mt-1">
                Asset Ref: {viewingRecord.assetId}
              </p>
            </header>

            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <History size={14} /> Log Details
                </h3>
                <div
                  className={cn(
                    "p-4 rounded-xl border space-y-3",
                    isDark
                      ? "bg-white/5 border-white/5"
                      : "bg-gray-50 border-gray-100"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      Reason
                    </span>
                    <span className="text-sm font-medium italic">
                      "{viewingRecord.reason}"
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      Execution Date
                    </span>
                    <div className="flex items-center gap-2 text-sm font-mono">
                      <Calendar size={12} /> {viewingRecord.decommissionDate}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      Authorized By
                    </span>
                    <div className="flex items-center gap-2 text-sm font-bold text-red-500">
                      <UserCheck size={12} /> {viewingRecord.approvedBy}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full mt-10 bg-red-600 hover:bg-red-700 font-black uppercase text-[10px] tracking-widest h-12 shadow-lg shadow-red-500/20">
              Generate Formal Certificate
            </Button>
          </aside>
        </div>
      )}

      <DecommissionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecord(null);
        }}
        onSave={handleSave}
        initialData={selectedRecord}
        isDark={isDark}
      />
    </Layout>
  );
};

export default Decommission;
