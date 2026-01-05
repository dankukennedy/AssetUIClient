import React from 'react';
import { Layout } from '../component/Layout';
import { Settings, Edit2, Lock, ShieldAlert } from 'lucide-react';

const AccountSettings = () => {
  return (
    <Layout title="Account Settings" icon={Settings}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className=" p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-gray-600">Profile Information</h3>
              <button className="text-blue-600 flex items-center gap-2 text-sm font-semibold hover:underline cursor-pointer ">
                <Edit2 size={14} /> EDIT
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">Full Name</label>
                <input type="text" defaultValue="John Doe" className="w-full p-3 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">Username</label>
                <input type="text" defaultValue="johndoe" className="w-full p-3 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className=" p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800"><Lock size={18}/> Security</h3>
            <button className="w-full py-3 bg-blue-600 cursor-pointer text-white rounded-xl text-sm font-bold shadow-sm shadow-blue-100">CHANGE PASSWORD</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountSettings;