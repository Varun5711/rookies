'use client';

import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} BharatSetu. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Help
            </a>
          </div>
        </div>
      </div>
      {/* Bottom Orange Bar */}
      <div className="h-1 w-full bg-orange-400" />
    </footer>
  );
}
