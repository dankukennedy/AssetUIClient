import React from 'react';
import { Layout } from '../component/Layout';
import { Users as UsersIcon, Plus, Edit2, Trash2 } from 'lucide-react';

const UsersPage = () => {
  const users = [
    { name: "Edem", role: "Administrator", status: "Active" },
    { name: "John Doe", role: "User", status: "Inactive" },
  ];

  return (
    <Layout title="User Management" icon={UsersIcon}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">System Users</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
            <Plus size={14} /> NEW USER
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user, i) => (
                <tr key={i} className="text-sm hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-700">{user.name}</td>
                  <td className="px-6 py-4 text-gray-500">{user.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="text-blue-500"><Edit2 size={14}/></button>
                    <button className="text-red-500"><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default UsersPage;