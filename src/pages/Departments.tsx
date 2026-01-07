import React, { useState, useMemo } from "react";
import { Layout } from "../component/Layout";
import {
  Users as UsersIcon,
  Plus,
  Edit2,
  Trash2,
  SquareArrowOutUpLeft,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  School2Icon,
  FileSpreadsheet,
  CheckCircle2, // Added for Toast
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";

// --- Types ---
interface Department {
  userId: string;
  name: string;
  blockId?: string;
  departmentId: string;
}

// --- Sub-Component: UserModal ---
interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Department) => void;
  initialData?: Department | null;
  isDark: boolean;
}

const UserModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isDark,
}: DepartmentModalProps) => {
  const [formData, setFormData] = useState<Department>({
    userId: "",
    name: "",
    blockId: "",
    departmentId: "",
  });

  React.useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ departmentId: "", userId: "", name: "", blockId: "" });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={cn(
          "w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transition-all transform animate-in fade-in zoom-in duration-200",
          isDark
            ? "bg-[#111118] border border-white/10 text-white"
            : "bg-white text-gray-900"
        )}
      >
        <div
          className={cn(
            "px-6 py-4 border-b flex justify-between items-center",
            isDark ? "border-white/5" : "border-gray-100"
          )}
        >
          <h3 className="font-bold text-lg">
            {initialData ? "Edit Department" : "Create New Department"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <form
          className="p-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
        >
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
              Department Name
            </label>
            <input
              required
              className={cn(
                "w-full px-4 py-2 rounded-lg border outline-none",
                isDark
                  ? "bg-black/20 border-white/10 text-white"
                  : "bg-gray-50 border-gray-200"
              )}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
              Department ID
            </label>
            <input
              required
              disabled={!!initialData}
              className={cn(
                "w-full px-4 py-2 rounded-lg border outline-none opacity-80",
                isDark
                  ? "bg-black/20 border-white/10 text-white"
                  : "bg-gray-50 border-gray-200"
              )}
              value={formData.departmentId}
              onChange={(e) =>
                setFormData({ ...formData, departmentId: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="default" type="submit">
              {initialData ? "Update Department" : "Create Department"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const DepartmentsPage = () => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [searchTerm, setSearchTerm] = useState("");
  const [nameFilter, setNameFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [viewingDepartment, setViewingDepartment] = useState<Department | null>(
    null
  );

  // --- Toast State ---
  const [showToast, setShowToast] = useState(false);
  const [toastMeta, setToastMeta] = useState({ title: "", sub: "" });

  const itemsPerPage = 6;

  const [departments, setDepartments] = useState<Department[]>([
    {
      userId: "12345tyu72",
      name: "IT",
      departmentId: "z0v5rr8r8r8733hy8",
      blockId: "Block D",
    },
    {
      userId: "12345tyu71",
      name: "Management",
      departmentId: "z0v5rr8r8r8733hy7",
      blockId: "Block A",
    },
    {
      userId: "12345tyu74",
      name: "Stores",
      departmentId: "z0v5rr8r8r8733hy5",
      blockId: "Block C",
    },
  ]);

  // --- Helper: Trigger Toast ---
  const triggerToast = (title: string, sub: string) => {
    setToastMeta({ title, sub });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // --- Logic: Delete ---
  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "CRITICAL: Permanent removal of department record. Proceed?"
      )
    ) {
      setDepartments(departments.filter((d) => d.departmentId !== id));
      triggerToast("Record Purged", `Department ${id} removed from system`);
    }
  };

  const handleSaveDepartment = (departmentData: Department) => {
    if (selectedDepartment) {
      setDepartments(
        departments.map((u) =>
          u.departmentId === selectedDepartment.departmentId
            ? departmentData
            : u
        )
      );
      triggerToast(
        "Registry Updated",
        `${departmentData.name} parameters modified`
      );
    } else {
      setDepartments([departmentData, ...departments]);
      triggerToast(
        "Department Created",
        `${departmentData.name} added to registry`
      );
    }
    setIsModalOpen(false);
  };

  const downloadCSV = () => {
    // ... (Your existing CSV logic)
    triggerToast("Export Successful", "Department data downloaded");
  };

  const filteredDepartments = useMemo(() => {
    return departments.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.departmentId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesName = nameFilter === "All" || d.name === nameFilter;
      return matchesSearch && matchesName;
    });
  }, [searchTerm, nameFilter, departments]);

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout title="Department Management" icon={UsersIcon}>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[300] animate-in slide-in-from-bottom-5 fade-in duration-300">
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
                {toastMeta.title}
              </span>
              <span className="text-[10px] opacity-70 uppercase tracking-widest font-bold">
                {toastMeta.sub}
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
            System Departments
          </h2>
          <p className="text-sm text-gray-500">Manage Department control</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="flex items-center gap-2 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 h-11"
          >
            <FileSpreadsheet size={18} /> Export CSV
          </Button>
          <Button
            className="flex items-center gap-2 shadow-lg h-11"
            onClick={() => {
              setSelectedDepartment(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={18} /> New Department
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className={cn(
          "p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 items-center justify-between",
          isDark
            ? "bg-[#111118] border border-white/5"
            : "bg-white border border-gray-100 shadow-sm"
        )}
      >
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            placeholder="Search records..."
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
        <select
          className={cn(
            "px-3 py-2 rounded-lg text-sm outline-none w-full md:w-48 font-bold",
            isDark
              ? "bg-black/20 border-white/10 text-white"
              : "bg-gray-50 border-gray-200"
          )}
          value={nameFilter}
          onChange={(e) => {
            setNameFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">All Departments</option>
          {Array.from(new Set(departments.map((d) => d.name))).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div
        className={cn(
          "rounded-xl border overflow-hidden",
          isDark
            ? "border-white/5 bg-[#111118]"
            : "border-gray-100 bg-white shadow-sm"
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
              <th className="px-6 py-4">Identity</th>
              <th className="px-6 py-4">Departments</th>
              <th className="px-6 py-4">Blocks</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody
            className={cn(
              "divide-y",
              isDark ? "divide-white/5" : "divide-gray-50"
            )}
          >
            {paginatedDepartments.map((department, i) => (
              <tr
                key={department.departmentId}
                className={cn(
                  "text-sm transition-colors",
                  isDark ? "hover:bg-white/5" : "hover:bg-blue-50/50"
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        "font-bold",
                        isDark ? "text-gray-200" : "text-gray-700"
                      )}
                    >
                      Department ID
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono">
                      {department.departmentId}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-500 uppercase">
                    {department.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-green-500/10 text-green-500 uppercase">
                    {department.blockId}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-yellow-500"
                      onClick={() => setViewingDepartment(department)}
                    >
                      <SquareArrowOutUpLeft size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500"
                      onClick={() => {
                        setSelectedDepartment(department);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(department.departmentId)} // Added delete handler
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div
          className={cn(
            "px-6 py-4 flex items-center justify-between border-t",
            isDark
              ? "border-white/5 bg-white/5"
              : "border-gray-100 bg-gray-50/30"
          )}
        >
          <span className="text-xs text-gray-500 font-mono">
            PTR: {filteredDepartments.length} RECORDS
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

      {/* Side Drawer & Modals remain same as your logic */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDepartment}
        initialData={selectedDepartment}
        isDark={isDark}
      />
    </Layout>
  );
};

export default DepartmentsPage;
