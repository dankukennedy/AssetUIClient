import React, { useState } from "react";
import { Layout } from "../component/Layout";
import {
  Recycle,
  Plus,
  FileCheck,
  Download,
  Trash2,
  Edit2,
  X,
  Activity,
  ShieldAlert,
  Calendar,
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";
import { DisposalModal } from "../models/DisposalsModal";
import { useToast } from "../context/ToastContext";

interface DisposalRecord {
  id: string;
  assetId: string;
  method: string;
  company: string;
  date?: string;
}

const Disposal = () => {
  const { theme } = useTheme();
  const { toast } = useToast();

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // --- States ---
  const [items, setItems] = useState<DisposalRecord[]>([
    {
      id: "DISP-552",
      assetId: "AST-102",
      method: "Eco-Recycle",
      company: "GreenTech Solutions",
      date: "2024-06-15",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DisposalRecord | null>(
    null
  );
  const [viewingRecord, setViewingRecord] = useState<DisposalRecord | null>(
    null
  );

  // --- Handlers ---
  const handleSave = (recordData: DisposalRecord) => {
    if (selectedRecord) {
      // Update existing
      setItems(items.map((i) => (i.id === selectedRecord.id ? recordData : i)));
      toast("Manifest Updated", "Disposal parameters reconfigured", "success");
    } else {
      // Add new
      setItems([recordData, ...items]);
      toast(
        "Disposal Logged",
        "Physical destruction record has been indexed",
        "success"
      );
    }
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Delete this disposal record? This will remove the audit trail for this asset's destruction."
      )
    ) {
      setItems(items.filter((item) => item.id !== id));
      toast("Record Purged", "Disposal entry removed from registry", "warning");
    }
  };

  const downloadCSV = () => {
    try {
      const headers = ["Disposal ID", "Asset ID", "Method", "Company", "Date"];
      const csvRows = items.map((i) =>
        [i.id, i.assetId, i.method, i.company, i.date || "N/A"].join(",")
      );

      const blob = new Blob([[headers.join(","), ...csvRows].join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `disposal_manifest_${new Date().getTime()}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast("Export Success", "Manifest downloaded as CSV", "success");
    } catch (err) {
      toast("Export Failed", "Could not generate CSV manifest", "error");
    }
  };

  return (
    <Layout title="Sanitization & Disposal" icon={Recycle}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2
            className={cn(
              "text-2xl font-black tracking-tight",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            Disposal Management
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Asset physical destruction and e-waste manifest logging
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="border-slate-700/50 hover:bg-slate-500/10 font-black text-[10px] uppercase tracking-widest"
          >
            <Download size={16} className="mr-2" /> Export Manifest
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 font-black text-[10px] uppercase tracking-widest px-6"
            onClick={() => {
              setSelectedRecord(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={16} className="mr-2" /> Log Disposal
          </Button>
        </div>
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
              <th className="px-6 py-4">Disposal ID</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Handling Entity</th>
              <th className="px-6 py-4">Asset ID</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody
            className={cn(
              "divide-y",
              isDark ? "divide-white/5" : "divide-gray-50"
            )}
          >
            {items.length > 0 ? (
              items.map((i) => (
                <tr
                  key={i.id}
                  className="text-sm hover:bg-emerald-500/5 transition-colors group"
                >
                  <td className="px-6 py-4 font-mono text-xs text-emerald-500 font-bold tracking-tighter">
                    {i.id}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                        isDark
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-emerald-50 text-emerald-700"
                      )}
                    >
                      {i.method}
                    </span>
                  </td>
                  <td
                    className={cn(
                      "px-6 py-4 font-bold",
                      isDark ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    {i.company}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {i.assetId}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-yellow-500 hover:bg-yellow-500/10 h-8 w-8"
                        onClick={() => setViewingRecord(i)}
                      >
                        <FileCheck size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-500 hover:bg-blue-500/10 h-8 w-8"
                        onClick={() => {
                          setSelectedRecord(i);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(i.id)}
                        className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 h-8 w-8"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500 italic text-sm"
                >
                  No disposal records currently found in the manifest.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Side Drawer for Record Details */}
      {viewingRecord && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setViewingRecord(null)}
          />
          <aside
            className={cn(
              "relative w-full max-w-lg h-full p-10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-300 border-l",
              isDark
                ? "bg-[#0d0d12] border-white/10 text-white"
                : "bg-white border-gray-200 text-gray-900"
            )}
          >
            <button
              onClick={() => setViewingRecord(null)}
              className="absolute top-6 right-6 text-gray-500 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>

            <header className="mb-10">
              <span className="px-3 py-1 rounded-lg text-[10px] font-black border border-emerald-500/50 text-emerald-500 mb-4 inline-block tracking-widest uppercase">
                Destruction Certificate
              </span>
              <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase italic text-emerald-500">
                {viewingRecord.id}
              </h2>
              <div className="flex items-center gap-2 text-gray-500 font-mono text-sm">
                <ShieldAlert size={14} /> Registered Asset:{" "}
                {viewingRecord.assetId}
              </div>
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
                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">
                  Handling Logistics
                </h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="text-gray-500 font-bold uppercase text-[10px]">
                    Method
                  </div>
                  <div className="font-black text-emerald-500 uppercase tracking-wider">
                    {viewingRecord.method}
                  </div>
                  <div className="text-gray-500 font-bold uppercase text-[10px]">
                    Entity
                  </div>
                  <div className="font-bold">{viewingRecord.company}</div>
                </div>
              </div>

              <div
                className={cn(
                  "rounded-2xl p-6 border",
                  isDark
                    ? "bg-white/5 border-white/5"
                    : "bg-gray-50 border-gray-100"
                )}
              >
                <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity size={12} /> Audit Details
                </h3>
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-500 italic flex items-center gap-2">
                      <Calendar size={12} /> Completion Date
                    </span>
                    <span className="font-bold">
                      {viewingRecord.date || "PENDING"}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 font-black uppercase text-[10px] tracking-widest py-6"
              >
                Download Official Certificate
              </Button>
            </section>
          </aside>
        </div>
      )}

      {/* Modal - Used for both Add and Edit */}
      <DisposalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecord(null);
        }}
        onSave={handleSave}
        initialData={selectedRecord} // Ensure DisposalModal accepts this prop for editing
        isDark={isDark}
      />
    </Layout>
  );
};

export default Disposal;
