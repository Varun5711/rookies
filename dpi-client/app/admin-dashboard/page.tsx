"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../lib/Sidebar';
import { Bell, Calendar, Download, LayoutDashboard, MessageSquare, Search, ShieldCheck, User } from 'lucide-react';

// --- Mock Data ---

const systemAlerts = [
  {
    id: "#LOG-9281",
    timestamp: "Oct 24, 2023 14:22",
    service: "Passport Seva",
    status: "Latency High",
    severity: "Medium",
    action: "Investigate"
  },
  {
    id: "#LOG-9282",
    timestamp: "Oct 24, 2023 14:10",
    service: "DigiLocker",
    status: "Resolved",
    severity: "Low",
    action: "Details"
  },
  {
    id: "#LOG-9283",
    timestamp: "Oct 24, 2023 13:45",
    service: "UPI Gateway",
    status: "Operational",
    severity: "Low",
    action: "Details"
  }
];

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      
      <Sidebar activePage="dashboard" />

      {/* --- Main Content --- */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-10 px-8 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Administrator Console</h2>
          
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative hidden lg:block w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search users, services, or logs..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 border-r border-slate-200 pr-6">
              <button className="relative text-slate-500 hover:text-blue-700">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <button className="text-slate-500 hover:text-blue-700">
                <MessageSquare size={20} />
              </button>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Admin" 
                className="w-9 h-9 rounded-full border border-slate-200"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          
          {/* Overview Header */}
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Overview</p>
              <h3 className="text-lg font-bold text-slate-900">Last 30 Days</h3>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <Calendar size={16} /> Date Range
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 shadow-sm shadow-blue-200">
                <Download size={16} /> Export Report
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Total Registered Users" 
              value="4,250,120" 
              trend="+2.4%" 
              trendLabel="vs last month"
              icon={<User size={24} className="text-blue-600" />}
            />
            <StatCard 
              title="Active Services" 
              value="124" 
              trend="+5" 
              trendLabel="new since last week"
              trendColor="text-blue-600 bg-blue-50"
              icon={<LayoutDashboard size={24} className="text-blue-600" />}
            />
            <StatCard 
              title="Service Health" 
              value="99.8%" 
              trend="Healthy" 
              trendLabel="All systems operational"
              trendColor="text-green-600 bg-green-50"
              icon={<ShieldCheck size={24} className="text-green-600" />}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Chart (Traffic) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="font-bold text-slate-900">Traffic Volume</h3>
                  <p className="text-sm text-slate-500">Transaction requests over the last 30 days</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">1.2M</div>
                  <div className="text-xs font-bold text-green-600">+12% growth</div>
                </div>
              </div>
              
              {/* Custom SVG Line Chart Simulation */}
              <div className="h-64 w-full relative">
                <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="0" x2="100" y2="0" stroke="#f1f5f9" strokeWidth="0.5" />
                  <line x1="0" y1="10" x2="100" y2="10" stroke="#f1f5f9" strokeWidth="0.5" />
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#f1f5f9" strokeWidth="0.5" />
                  <line x1="0" y1="30" x2="100" y2="30" stroke="#f1f5f9" strokeWidth="0.5" />
                  <line x1="0" y1="40" x2="100" y2="40" stroke="#f1f5f9" strokeWidth="0.5" />
                  
                  {/* The Line */}
                  <path 
                    d="M0 35 C 5 35, 5 20, 10 15 C 15 10, 20 25, 25 22 C 30 19, 35 30, 40 18 C 45 6, 50 18, 55 16 C 60 14, 65 35, 70 38 C 75 41, 80 10, 85 5 C 90 0, 95 30, 100 20" 
                    fill="none" 
                    stroke="#2563eb" 
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {/* Area under curve (optional, for aesthetics) */}
                  <path 
                    d="M0 35 C 5 35, 5 20, 10 15 C 15 10, 20 25, 25 22 C 30 19, 35 30, 40 18 C 45 6, 50 18, 55 16 C 60 14, 65 35, 70 38 C 75 41, 80 10, 85 5 C 90 0, 95 30, 100 20 V 40 H 0 Z" 
                    fill="url(#gradient)" 
                    opacity="0.1"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* X-Axis Labels */}
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mt-2">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                </div>
              </div>
            </div>

            {/* Side Chart (Distribution) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="mb-6">
                <h3 className="font-bold text-slate-900">Category Distribution</h3>
                <p className="text-sm text-slate-500">Services by department</p>
              </div>
              
              <div className="space-y-6 flex-1">
                <ProgressBar label="Health Dept" percentage={45} color="bg-blue-600" />
                <ProgressBar label="Education" percentage={25} color="bg-blue-400" />
                <ProgressBar label="Transport" percentage={20} color="bg-blue-300" />
                <ProgressBar label="Taxation" percentage={10} color="bg-slate-400" />
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <div className="text-3xl font-bold text-slate-900">45</div>
                <div className="text-xs text-slate-500">Participating Departments</div>
              </div>
            </div>
          </div>

          {/* System Alerts Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Recent System Alerts</h3>
              <button className="text-sm font-semibold text-blue-700 hover:underline">View All Logs</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Alert ID</th>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Service Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Severity</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {systemAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-500">{alert.id}</td>
                      <td className="px-6 py-4">{alert.timestamp}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${alert.status === 'Resolved' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                          {alert.service}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                          alert.status === 'Latency High' ? 'bg-yellow-100 text-yellow-700' : 
                          alert.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {alert.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={alert.severity === 'Medium' ? 'text-orange-600 font-semibold' : 'text-slate-500'}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-blue-700 font-medium hover:underline">
                          {alert.action}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

// --- Helper Components ---

const StatCard = ({ title, value, trend, trendLabel, icon, trendColor = "text-green-600 bg-green-50" }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900 mb-4">{value}</h3>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${trendColor}`}>
          {trend}
        </span>
        <span className="text-xs text-slate-400">{trendLabel}</span>
      </div>
    </div>
    <div className="p-3 bg-slate-50 rounded-lg">
      {icon}
    </div>
  </div>
);

const ProgressBar = ({ label, percentage, color }: { label: string, percentage: number, color: string }) => (
  <div>
    <div className="flex justify-between mb-2 text-sm">
      <span className="font-semibold text-slate-700">{label}</span>
      <span className="text-slate-500">{percentage}%</span>
    </div>
    <div className="w-full bg-slate-100 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${color}`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

export default AdminDashboard;