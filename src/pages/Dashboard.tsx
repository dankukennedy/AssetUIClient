import React, { useState } from "react";
import { Layout } from "../component/Layout";
import {
  LayoutDashboard,
  Box,
  Users,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
  Maximize2,
  Activity,
} from "lucide-react";
import { useTheme } from "../component/theme-provider";
import { cn } from "../lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { DashboardModal } from "../models/DashboardModal";

const inventoryData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 700 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 900 },
  { name: "May", value: 1100 },
  { name: "Jun", value: 1284 },
];

const categoryData = [
  { name: "Laptops", count: 450, color: "#3b82f6" },
  { name: "Mobile", count: 300, color: "#a855f7" },
  { name: "Monitors", count: 280, color: "#f97316" },
  { name: "Peripherals", count: 254, color: "#10b981" },
];

const Dashboard = () => {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    {
      label: "Total Assets",
      value: "1,284",
      icon: Box,
      color: "blue",
      trend: "+12.5%",
      glow: "group-hover:shadow-blue-500/20",
    },
    {
      label: "Active Users",
      value: "42",
      icon: Users,
      color: "purple",
      trend: "+3 new",
      glow: "group-hover:shadow-purple-500/20",
    },
    {
      label: "Pending Audits",
      value: "12",
      icon: AlertCircle,
      color: "orange",
      trend: "High Risk",
      glow: "group-hover:shadow-orange-500/20",
    },
  ];

  return (
    <Layout title="Analytics Overview" icon={LayoutDashboard}>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={cn(
              "p-6 rounded-3xl border transition-all duration-300 group relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl",
              stat.glow,
              isDark
                ? "bg-[#111118]/60 backdrop-blur-xl border-white/5"
                : "bg-white border-gray-100 shadow-sm"
            )}
          >
            {/* Background Glow Effect */}
            <div
              className={cn(
                "absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20",
                `bg-${stat.color}-500`
              )}
            />

            <div className="flex items-center justify-between mb-6">
              <div
                className={cn(
                  "p-3 rounded-2xl",
                  isDark ? `bg-${stat.color}-500/10` : `bg-${stat.color}-50`
                )}
              >
                <stat.icon size={22} className={`text-${stat.color}-500`} />
              </div>
              <span
                className={cn(
                  "text-[11px] font-bold px-3 py-1 rounded-full border",
                  stat.trend.includes("+")
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                )}
              >
                {stat.trend}
              </span>
            </div>

            <div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.15em] mb-1">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2">
                <h3
                  className={cn(
                    "text-4xl font-bold tracking-tight",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  {stat.value}
                </h3>
                <Activity
                  size={14}
                  className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute bottom-6 right-6 p-2 rounded-full bg-gray-500/5 opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-500 hover:text-white"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Area Chart (Spans 2 columns) */}
        <div
          className={cn(
            "lg:col-span-2 p-8 rounded-[32px] border relative overflow-hidden",
            isDark
              ? "bg-[#111118]/60 backdrop-blur-xl border-white/5"
              : "bg-white border-gray-100 shadow-sm"
          )}
        >
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-500" /> Asset Growth
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Performance over the last 6 months
              </p>
            </div>
            <div className="flex gap-2">
              {["1M", "6M", "1Y"].map((t) => (
                <button
                  key={t}
                  className={cn(
                    "px-3 py-1 text-[10px] font-bold rounded-lg transition-colors",
                    t === "6M"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-500/10 text-gray-500"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inventoryData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke={isDark ? "#ffffff05" : "#00000005"}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 600, fill: "#6b7280" }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                    strokeDasharray: "5 5",
                  }}
                  contentStyle={{
                    backgroundColor: isDark ? "#0d0d12" : "#fff",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution (Spans 1 column) */}
        <div
          className={cn(
            "p-8 rounded-[32px] border",
            isDark
              ? "bg-[#111118]/60 backdrop-blur-xl border-white/5"
              : "bg-white border-gray-100 shadow-sm"
          )}
        >
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-base font-bold">Distribution</h3>
            <button className="p-2 hover:bg-gray-500/10 rounded-xl transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="space-y-6">
            {categoryData.map((item, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {item.name}
                  </span>
                  <span className="text-xs font-black">{item.count}</span>
                </div>
                <div className="h-2 w-full bg-gray-500/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 group-hover:brightness-125"
                    style={{
                      width: `${(item.count / 500) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10">
            <p className="text-[11px] text-blue-500 font-bold mb-1 italic">
              Quick Tip:
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Laptops account for 45% of your total hardware inventory.
            </p>
          </div>
        </div>
      </div>

      <DashboardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isDark={isDark}
      />
    </Layout>
  );
};

export default Dashboard;
