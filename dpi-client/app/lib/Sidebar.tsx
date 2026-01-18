"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ScrollText,
  Server,
  FileBarChart,
  Settings,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: React.MouseEventHandler<HTMLButtonElement> }) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-colors text-sm font-medium ${
    active
      ? 'bg-blue-50 text-blue-700'
      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
  }`}>
    {icon}
    {label}
  </button>
);

type ActivePage = 'dashboard' | 'service-registry' | 'audit-logs' | 'analytics' | 'settings';

export const Sidebar = ({ activePage }: { activePage: ActivePage }) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 fixed h-full hidden md:flex flex-col z-20">
      
      {/* Logo Area */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100">
        <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white p-2">
           <ShieldCheck size={20} />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 leading-tight">Bharat Setu</h1>
          <p className="text-[8px] uppercase tracking-wider text-slate-500 font-semibold">One Platform,  Many Services</p>
        </div>
      </div>

      {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activePage === 'dashboard'} 
            onClick={() => handleNavigation('/admin-dashboard')} 
          />
          <NavItem 
            icon={<ScrollText size={20} />} 
            label="Service Registry" 
            active={activePage === 'service-registry'} 
            onClick={() => handleNavigation('/service-registry')} 
          />
          <NavItem 
            icon={<Server size={20} />} 
            label="Audit Logs" 
            active={activePage === 'audit-logs'} 
            onClick={() => handleNavigation('/audit-logs')} 
          />
          <NavItem 
            icon={<FileBarChart size={20} />} 
            label="Analytics" 
            active={activePage === 'analytics'} 
            onClick={() => handleNavigation('/analytics')} 
          />
        </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <NavItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={activePage === 'settings'}
            onClick={() => handleNavigation('/settings')} 
        />
        <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-sm font-medium">
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
