import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, X } from "lucide-react";
import { cn } from "../lib/utils";

type ToastType = "success" | "error" | "warning";

interface Toast {
  id: string;
  title: string;
  sub: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (title: string, sub: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    (title: string, sub: string, type: ToastType = "success") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, sub, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case "error":
        return "border-red-500/50 bg-white dark:bg-[#1a1111] text-red-600 dark:text-red-400 shadow-red-500/10";
      case "warning":
        return "border-amber-500/50 bg-white dark:bg-[#1a1611] text-amber-600 dark:text-amber-400 shadow-amber-500/10";
      default:
        return "border-blue-500/50 bg-white dark:bg-[#111118] text-blue-600 dark:text-blue-400 shadow-blue-500/10";
    }
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border min-w-[320px] animate-in slide-in-from-right-10 fade-in duration-300",
              getToastStyles(t.type)
            )}
          >
            {t.type === "success" && <CheckCircle2 size={20} />}
            {t.type === "error" && <AlertCircle size={20} />}
            {t.type === "warning" && <AlertTriangle size={20} />}
            <div className="flex flex-col flex-1">
              <span className="text-sm font-black tracking-tight leading-none mb-1">
                {t.title}
              </span>
              <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold font-mono">
                {t.sub}
              </span>
            </div>
            <button
              onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}
              className="opacity-40 hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
