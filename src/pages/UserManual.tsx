import React from "react";
import { Layout } from "../component/Layout";
import { BookOpen, Key, RefreshCcw, UserPlus } from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";

const UserManual = () => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const guides = [
    {
      title: "Registering Assets",
      desc: "How to add new hardware to the central registry and assign unique IDs.",
      icon: BookOpen,
    },
    {
      title: "Identity Provisioning",
      desc: "Setting up new user profiles and linking them to specific hardware nodes.",
      icon: UserPlus,
    },
    {
      title: "Resource Transfer",
      desc: "Moving assets between departments or personnel without data loss.",
      icon: RefreshCcw,
    },
    {
      title: "Access Protocols",
      desc: "Managing administrative permissions and security clearance levels.",
      icon: Key,
    },
  ];

  return (
    <Layout title="Documentation" icon={BookOpen}>
      <div className="max-w-5xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {guides.map((guide) => (
            <div
              key={guide.title}
              className={cn(
                "p-8 rounded-[2rem] border group hover:border-blue-500/50 transition-all cursor-pointer",
                isDark
                  ? "bg-[#111118] border-white/5"
                  : "bg-white border-gray-100 shadow-sm"
              )}
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <guide.icon size={24} />
              </div>
              <h3
                className={cn(
                  "text-xl font-black uppercase tracking-tighter mb-3",
                  isDark ? "text-white" : "text-gray-900"
                )}
              >
                {guide.title}
              </h3>
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  isDark ? "text-gray-500" : "text-gray-600"
                )}
              >
                {guide.desc}
              </p>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                Read Guide <span className="text-lg">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default UserManual;
