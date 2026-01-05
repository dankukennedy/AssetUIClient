import React from 'react';
import { Layout } from '../component/Layout';
import { Box } from 'lucide-react';

const BlocksPage = () => {
  return (
    <Layout title="Blocks Management" icon={Box}>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Blocks</h2>
        {/* Your table or grid logic here */}
        <p className="text-gray-500">Manage your physical building blocks and locations.</p>
      </div>
    </Layout>
  );
};

export default BlocksPage;