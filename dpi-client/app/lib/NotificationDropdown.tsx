"use client";
import React, { useState } from 'react';
import { Bell } from 'lucide-react';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        className="relative text-slate-500 hover:text-blue-700" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />
        {/* Red dot for notifications */}
        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-slate-200 z-30">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
            <span className="text-xs text-blue-600 font-medium">Mark all as read</span>
          </div>
          <div className="divide-y divide-slate-100">
            {/* Dummy Notifications */}
            <div className="p-3 hover:bg-slate-50">
              <p className="text-xs text-slate-900 font-medium">Service 'Aadhaar Auth API' is experiencing degraded performance.</p>
              <p className="text-[10px] text-slate-500 mt-1">5 minutes ago</p>
            </div>
            <div className="p-3 hover:bg-slate-50">
              <p className="text-xs text-slate-900 font-medium">New registration request for 'Passport Seva'.</p>
              <p className="text-[10px] text-slate-500 mt-1">1 hour ago</p>
            </div>
            <div className="p-3 hover:bg-slate-50 text-center border-t border-slate-100">
                <a href="#" className="text-xs text-blue-700 font-medium hover:underline">View All Notifications</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
