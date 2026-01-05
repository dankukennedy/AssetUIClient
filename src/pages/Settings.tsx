import { Settings as SettingsIcon, Lock, Edit2, ShieldAlert } from 'lucide-react';
import { Layout } from '../component/Layout';

export default function Settings() {
  return (
    <Layout title="Account Settings" icon={SettingsIcon}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold text-gray-800">Profile Information</h3>
            <button className="text-blue-600 text-sm font-bold flex items-center gap-1"><Edit2 size={14}/> EDIT</button>
          </div>
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-3xl font-bold text-gray-400 border-4 border-white shadow-lg">J</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
              <input type="text" defaultValue="John Doe" className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Username</label>
              <input type="text" defaultValue="johndoe" className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
              <input type="email" defaultValue="john.doe@example.com" className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold flex items-center gap-2 mb-4"><Lock size={18}/> Change Password</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">Password management is disabled. Click "Change" to enable.</p>
            <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-100">CHANGE</button>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-50 border-t-4 border-t-red-500">
            <h3 className="font-bold text-red-600 flex items-center gap-2 mb-6"><ShieldAlert size={18}/> Danger Zone</h3>
            <button className="w-full py-3 border border-red-200 text-red-600 rounded-xl text-xs font-bold mb-3">DEACTIVATE ACCOUNT</button>
            <button className="w-full py-3 bg-red-600 text-white rounded-xl text-xs font-bold">DELETE ACCOUNT</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}