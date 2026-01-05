import React from 'react';
import { Layout } from '../component/Layout';
import { Box, Plus, Edit2, Trash2 } from 'lucide-react';

const AssetManagement = () => {
  const assets = [
    { id: "AST-001", name: "MacBook Pro", type: "Laptop", status: "Active" },
    { id: "AST-002", name: "Dell Monitor", type: "Peripheral", status: "In Repair" },
  ];

  return (
    <Layout title="Asset Management" icon={Box}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Asset Registry</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          <Plus size={16} /> Add Asset
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400">
            <tr>
              <th className="px-6 py-4">Asset ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {assets.map((asset) => (
              <tr key={asset.id} className="text-sm hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium">{asset.id}</td>
                <td className="px-6 py-4">{asset.name}</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold">{asset.status}</span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button className="p-2 text-blue-500"><Edit2 size={14}/></button>
                  <button className="p-2 text-red-500"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default AssetManagement;