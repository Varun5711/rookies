/**
 * Admin Guard Component
 * Wraps admin pages to ensure only PLATFORM_ADMIN can access
 */

'use client';

import React from 'react';
import { useAdminCheck } from '@/lib/hooks/useAdminCheck';
import { Shield, AlertTriangle } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { isAdmin, isLoading } = useAdminCheck();

  if (isLoading) {
    return fallback || <AdminGuardLoading />;
  }

  if (!isAdmin) {
    return fallback || <AdminGuardUnauthorized />;
  }

  return <>{children}</>;
}

function AdminGuardLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700" />
        <p className="text-sm text-gray-600">Verifying admin access...</p>
      </div>
    </div>
  );
}

function AdminGuardUnauthorized() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-red-50 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-center text-gray-600 mb-6">
            You do not have administrator privileges to access this page.
          </p>
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <p>Admin pages require PLATFORM_ADMIN role</p>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <p>Contact your system administrator for access</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <a
              href="/dashboard"
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Citizen Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
