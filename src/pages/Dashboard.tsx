import React from 'react';
import { Layout } from '../component/Layout';
import { LayoutDashboard, Box, Users, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: "Total Assets", value: "1,284", icon: Box, color: "text-blue-500" },
    { label: "Active Users", value: "42", icon: Users, color: "text-purple-500" },
    { label: "Pending Audits", value: "12", icon: AlertCircle, color: "text-orange-500" },
  ];

  return (
    <Layout title="Dashboard" icon={LayoutDashboard}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Dashboard;