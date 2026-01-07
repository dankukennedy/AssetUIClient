import React from "react";
import { Layout } from "../component/Layout";
import { Info, Shield, Zap, Globe } from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";

const About = () => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const stats = [
    { label: "Assets Tracked", value: "12,400+", icon: Zap },
    { label: "Global Nodes", value: "24", icon: Globe },
    { label: "Security Level", value: "EAL6+", icon: Shield },
  ];

  return (
    <Layout title="System Overview" icon={Info}>
      <div className="max-w-4xl mx-auto py-12">
        <header className="mb-16 text-center">
          <h2
            className={cn(
              "text-5xl font-black tracking-tighter uppercase mb-4",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            Asset Sentinel <span className="text-blue-600">v4.0</span>
          </h2>
          <p className="text-sm font-mono text-gray-500 uppercase tracking-[0.3em]">
            Next-Generation Resource Intelligence
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "p-8 rounded-[2rem] border text-center",
                isDark
                  ? "bg-[#111118] border-white/5"
                  : "bg-white border-gray-100"
              )}
            >
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">
                {stat.label}
              </p>
              <p
                className={cn(
                  "text-3xl font-black",
                  isDark ? "text-white" : "text-gray-900"
                )}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <article
          className={cn(
            "prose prose-sm max-w-none font-medium leading-relaxed",
            isDark ? "text-gray-400" : "text-gray-600"
          )}
        >
          <p className="mb-6">
            Designed for modern enterprises, our Asset Management System
            provides a unified interface for tracking the lifecycle of critical
            hardware. From initial registry to end-of-life decommissioning,
            every state change is logged with cryptographic precision.
          </p>
          <p>
            Our core mission is to eliminate resource waste and provide IT
            departments with real-time visibility into their global hardware
            footprint.
          </p>
        </article>
      </div>
    </Layout>
  );
};

export default About;
