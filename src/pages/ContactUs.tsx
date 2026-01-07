import React from "react";
import { Layout } from "../component/Layout";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import { Button } from "../component/ui/button";

const ContactUs = () => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <Layout title="Support Terminal" icon={Mail}>
      <div className="max-w-2xl mx-auto py-12">
        <div
          className={cn(
            "p-10 rounded-[2.5rem] border",
            isDark
              ? "bg-[#111118] border-white/5"
              : "bg-white border-gray-100 shadow-sm"
          )}
        >
          <div className="mb-10">
            <h2
              className={cn(
                "text-3xl font-black tracking-tighter uppercase mb-2",
                isDark ? "text-white" : "text-gray-900"
              )}
            >
              Signal Support
            </h2>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
              Typical Response: &lt; 2 Hours
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">
                Subject Matter
              </label>
              <input
                type="text"
                className={cn(
                  "w-full h-14 px-6 rounded-2xl border outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                  isDark
                    ? "bg-black/20 border-white/10 text-white"
                    : "bg-gray-50 border-gray-200"
                )}
                placeholder="Technical Support / Billing / Feedback"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">
                Detailed Inquiry
              </label>
              <textarea
                rows={5}
                className={cn(
                  "w-full p-6 rounded-2xl border outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none",
                  isDark
                    ? "bg-black/20 border-white/10 text-white"
                    : "bg-gray-50 border-gray-200"
                )}
                placeholder="Describe your requirement..."
              />
            </div>
            <Button className="w-full h-14 rounded-2xl bg-blue-600 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">
              <Send size={16} className="mr-2" /> Dispatch Message
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
