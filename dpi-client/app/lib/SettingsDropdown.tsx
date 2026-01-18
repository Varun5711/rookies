"use client";
import React, { useState } from 'react';
import { Settings, User, LogOut, HelpCircle } from 'lucide-react';

export const SettingsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        className="text-slate-500 hover:text-blue-700" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <Settings size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-30">
          <div className="py-2 divide-y divide-slate-100">
            <div className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-2">
                <User size={16} /> Profile
            </div>
            <div className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-2">
                <Settings size={16} /> Account Settings
            </div>
            <div className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-700">
                <LogOut size={16} /> Sign Out
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;
