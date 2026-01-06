import React from 'react';
import { Layout } from '../component/Layout';
import { Users } from 'lucide-react';

const DepartmentPage = () => {
  return (
    <Layout title="Departments" icon={Users}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Example card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition-colors">
          <h3 className="font-bold text-gray-800">IT Department</h3>
          <p className="text-sm text-gray-500 mt-2">12 Assets Assigned</p>
        </div>
      </div>
    </Layout>
  );
};

export default DepartmentPage;