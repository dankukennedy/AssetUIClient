import React, { useState } from 'react';
import { Layout } from '../component/Layout';
import { 
  LayoutDashboard, Box, Users, AlertCircle, TrendingUp, 
  ArrowUpRight, MoreHorizontal, Maximize2 
} from 'lucide-react';
import { useTheme } from '../component/theme-provider';
import { cn } from '../lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';
import { DashboardModal } from '../models/DashboardModal';

// Mock Data for Charts
const inventoryData = [
  { name: 'Jan', value: 400 }, { name: 'Feb', value: 700 },
  { name: 'Mar', value: 500 }, { name: 'Apr', value: 900 },
  { name: 'May', value: 1100 }, { name: 'Jun', value: 1284 },
];

const categoryData = [
  { name: 'Laptops', count: 450, color: '#3b82f6' },
  { name: 'Mobile', count: 300, color: '#a855f7' },
  { name: 'Monitors', count: 280, color: '#f97316' },
  { name: 'Peripherals', count: 254, color: '#10b981' },
];

const Dashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { label: "Total Assets", value: "1,284", icon: Box, color: "text-blue-500", trend: "+12.5%" },
    { label: "Active Users", value: "42", icon: Users, color: "text-purple-500", trend: "+3 new" },
    { label: "Pending Audits", value: "12", icon: AlertCircle, color: "text-orange-500", trend: "High Risk" },
  ];

  return (
    <Layout title="Dashboard" icon={LayoutDashboard}>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className={cn(
            "p-6 rounded-2xl border transition-all group relative overflow-hidden",
            isDark ? "bg-[#111118] border-white/5" : "bg-white border-gray-100 shadow-sm"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg bg-opacity-10", stat.color.replace('text', 'bg'))}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <span className={cn("text-[10px] font-black px-2 py-1 rounded-full", 
                stat.trend.includes('+') ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500")}>
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{stat.label}</p>
            <h3 className={cn("text-3xl font-black mt-1 tracking-tighter", isDark ? "text-white" : "text-gray-900")}>
              {stat.value}
            </h3>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-blue-500"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Trend Area Chart */}
        <div className={cn("p-8 rounded-3xl border", isDark ? "bg-[#111118] border-white/5" : "bg-white border-gray-100 shadow-sm")}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-500" /> Growth Analytics
              </h3>
              <p className="text-xs text-gray-500 mt-1">Net asset acquisition per month</p>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500"><MoreHorizontal size={18}/></button>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inventoryData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#ffffff10" : "#00000005"} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: isDark ? '#0d0d12' : '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Bar Chart */}
        <div className={cn("p-8 rounded-3xl border", isDark ? "bg-[#111118] border-white/5" : "bg-white border-gray-100 shadow-sm")}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
               Asset Distribution
            </h3>
            <button className="text-[10px] font-black text-blue-500 flex items-center gap-1">VIEW ALL <ArrowUpRight size={12}/></button>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" barSize={12}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} width={80} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" radius={[0, 10, 10, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <DashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isDark={isDark} />
    </Layout>
  );
};

export default Dashboard;