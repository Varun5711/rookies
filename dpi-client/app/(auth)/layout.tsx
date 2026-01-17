import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Tricolor Top Border */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-white to-green-600" />

      <div className="flex-1 flex items-center justify-center p-4">
        {children}
      </div>

      {/* Bottom Orange Bar */}
      <div className="h-1 w-full bg-orange-400" />
    </div>
  );
}
