'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { useAuthStore } from '@/lib/store/authStore';
import { UserRole } from '@/lib/types/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, hasHydrated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Wait for client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Don't check until component is mounted and store has hydrated
    if (!mounted || !hasHydrated || isLoading) {
      return;
    }

    // Check for token first
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    // If no user after hydration, redirect to login
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if user is admin
    const hasAdminRole = 
      user.roles && 
      Array.isArray(user.roles) && 
      user.roles.includes(UserRole.PLATFORM_ADMIN);
    
    if (!hasAdminRole) {
      router.push('/dashboard');
      return;
    }
  }, [mounted, hasHydrated, isAuthenticated, user, isLoading, router]);

  // Show loading while mounting, hydrating, or loading
  if (!mounted || !hasHydrated || isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700" />
          <p className="text-sm text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Final check - if we get here without user or admin role, something went wrong
  const hasAdminRole = 
    user.roles && 
    Array.isArray(user.roles) && 
    user.roles.includes(UserRole.PLATFORM_ADMIN);

  if (!hasAdminRole) {
    // This shouldn't happen due to useEffect redirect, but as a safety measure
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar variant="admin" />
      <div className="flex flex-1">
        <Sidebar variant="admin" />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
