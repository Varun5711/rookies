"use client";
import { useRouter } from "next/navigation";
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Server, 
  Users, 
  ShieldCheck, 
  BarChart3, 
  FileText, 
  Activity, 
  Search, 
  Bell, 
  Settings, 
  HelpCircle,
  Download,
  Plus,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  Wallet,
  FolderLock,
  PenTool,
  Syringe,
  ScrollText,
  FileBarChart,
} from 'lucide-react';
import { Sidebar } from '../lib/Sidebar';
import { NotificationDropdown } from '../lib/NotificationDropdown';
import { SettingsDropdown } from '../lib/SettingsDropdown';

// --- Types & Mock Data ---

interface ServiceItem {
  id: string;
  name: string;
  serviceId: string;
  provider: string;
  providerType: string;
  status: 'Operational' | 'Downtime Detected' | 'Degraded Performance' | 'Maintenance';
  lastUpdated: string;
  endpoint: string;
  icon: React.ReactNode;
}

const servicesData: ServiceItem[] = [
  {
    id: "1",
    name: "Aadhaar Auth API",
    serviceId: "AUTH-001-V2",
    provider: "UIDAI",
    providerType: "Identity & Auth",
    status: "Operational",
    lastUpdated: "2 mins ago",
    endpoint: "/api/v2/auth/verify",
    icon: <Fingerprint size={20} className="text-blue-600" />
  },
  {
    id: "2",
    name: "UPI Payment Gateway",
    serviceId: "PAY-UPI-GATE",
    provider: "NPCI",
    providerType: "Financial Services",
    status: "Operational",
    lastUpdated: "5 mins ago",
    endpoint: "/api/v1/payment/transact",
    icon: <Wallet size={20} className="text-purple-600" />
  },
  {
    id: "3",
    name: "Digilocker Doc Fetch",
    serviceId: "DL-DOC-RET",
    provider: "MeitY",
    providerType: "Document Services",
    status: "Downtime Detected",
    lastUpdated: "1 hr ago",
    endpoint: "/api/v3/docs/pull",
    icon: <FolderLock size={20} className="text-blue-500" />
  },
  {
    id: "4",
    name: "eSign Service",
    serviceId: "ESIGN-STD",
    provider: "CDAC",
    providerType: "Digital Signature",
    status: "Degraded Performance",
    lastUpdated: "15 mins ago",
    endpoint: "/api/v1/sign/pdf",
    icon: <PenTool size={20} className="text-pink-600" />
  },
  {
    id: "5",
    name: "CoWIN Vaccination",
    serviceId: "VAC-COWIN",
    provider: "MoHFW",
    providerType: "Health Services",
    status: "Operational",
    lastUpdated: "Just now",
    endpoint: "/api/v4/cert/download",
    icon: <Syringe size={20} className="text-teal-600" />
  }
];

const ServiceRegistry: React.FC = () => {
    const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      
      <Sidebar activePage="service-registry" />

      {/* --- Main Content --- */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 px-6 lg:px-8 flex justify-between items-center">
          
          {/* Search (Global) */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search resources..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 border-r border-slate-200 pr-6">
              <NotificationDropdown />
              <SettingsDropdown />
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200"></div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-slate-900">Setu User</p>
                <p className="text-xs text-slate-500">System Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 space-y-8 bg-slate-50/50">
          
          {/* Breadcrumb & Header */}
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <Server size={14} />
              <span>/</span>
              <span>Admin</span>
              <span>/</span>
              <span className="text-slate-900 font-medium">Service Registry</span>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Service Registry Management</h1>
                <p className="text-slate-500 text-sm mt-1">Manage and monitor all registered government microservices and integrations.</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <Download size={16} /> Export Report
                </button>
                <button onClick={() => router.push("/service-registry/new-service")} className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 shadow-sm shadow-blue-200">
                  <Plus size={16} /> Register New Service
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              label="Total Services" 
              value="142" 
              trend="12" 
              trendUp={true} 
              icon={<LayoutDashboard size={24} className="text-blue-600" />} 
              bgColor="bg-blue-50"
              iconBg="bg-blue-100"
            />
            <StatCard 
              label="Operational" 
              value="135" 
              trend="5%" 
              trendUp={true} 
              icon={<ShieldCheck size={24} className="text-green-600" />} 
              bgColor="bg-green-50"
              iconBg="bg-green-100"
            />
            <StatCard 
              label="Critical Issues" 
              value="3" 
              trend="2%" 
              trendUp={false} 
              icon={<Activity size={24} className="text-red-600" />} 
              bgColor="bg-red-50"
              iconBg="bg-red-100"
            />
            <StatCard 
              label="Maintenance" 
              value="4" 
              trend="stable" 
              trendUp={true} 
              isNeutral={true}
              icon={<Settings size={24} className="text-yellow-700" />} 
              bgColor="bg-yellow-50"
              iconBg="bg-yellow-100"
            />
          </div>

          {/* Filters & Table Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            
            {/* Filter Toolbar */}
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input 
                  type="text" 
                  placeholder="Search by service name, provider, or ID..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-3">
                <Dropdown label="All Providers" />
                <Dropdown label="All Statuses" />
                <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                  <Filter size={16} /> More Filters
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Service Name</th>
                    <th className="px-6 py-4">Provider</th>
                    <th className="px-6 py-4">Health Status</th>
                    <th className="px-6 py-4">Last Updated</th>
                    <th className="px-6 py-4">Endpoint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {servicesData.map((service) => (
                    <tr key={service.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                            {service.icon}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{service.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">ID: {service.serviceId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{service.provider}</p>
                        <p className="text-xs text-slate-500">{service.providerType}</p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={service.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {service.lastUpdated}
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 font-mono">
                          {service.endpoint}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 flex justify-between items-center">
              <p className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-900">1 to 5</span> of <span className="font-bold text-slate-900">142</span> results
              </p>
              
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-700 text-white text-sm font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">3</button>
                <span className="w-8 text-center text-slate-400 text-xs">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">8</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:text-slate-600 hover:bg-slate-50">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

// --- Helper Components ---

const StatCard = ({ label, value, trend, trendUp, icon, bgColor, iconBg, isNeutral }: any) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
    <div className={`absolute right-0 top-0 w-24 h-24 rounded-bl-full opacity-20 ${bgColor}`}></div>
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center`}>
        {icon}
      </div>
      {/* Decorative circle */}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <span className={`text-xs font-bold flex items-center ${
          isNeutral ? 'text-slate-500' :
          trendUp ? 'text-green-600' : 'text-red-600'
        }`}>
          {trendUp ? '↑' : '↓'} {trend}
        </span>
      </div>
    </div>
  </div>
);

const Dropdown = ({ label }: { label: string }) => (
  <div className="relative group">
    <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 min-w-[140px] justify-between">
      {label}
      <ChevronDown size={14} className="text-slate-400" />
    </button>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  let styles = "";
  let dotColor = "";
  
  switch(status) {
    case 'Operational':
      styles = "bg-green-50 text-green-700 border-green-200";
      dotColor = "bg-green-500";
      break;
    case 'Downtime Detected':
      styles = "bg-red-50 text-red-700 border-red-200";
      dotColor = "bg-red-500";
      break;
    case 'Degraded Performance':
      styles = "bg-yellow-50 text-yellow-700 border-yellow-200";
      dotColor = "bg-yellow-500";
      break;
    default:
      styles = "bg-slate-50 text-slate-600 border-slate-200";
      dotColor = "bg-slate-400";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {status}
    </span>
  );
};

export default ServiceRegistry;