/**
 * Admin Role Check Hook
 * Ensures only PLATFORM_ADMIN users can access admin pages
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { UserRole } from '@/lib/types/auth';

export function useAdminCheck() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated || !user) {
      router.push('/login?redirect=/admin/dashboard');
      return;
    }

    // Ensure roles array exists and check for admin role
    const hasAdminRole = 
      user.roles && 
      Array.isArray(user.roles) && 
      user.roles.includes(UserRole.PLATFORM_ADMIN);

    // Not an admin - redirect to citizen dashboard
    if (!hasAdminRole) {
      router.push('/dashboard');
      return;
    }
  }, [user, isAuthenticated, isLoading, router]);

  const isAdmin = 
    user?.roles && 
    Array.isArray(user.roles) && 
    user.roles.includes(UserRole.PLATFORM_ADMIN) || false;

  return {
    isAdmin,
    isLoading,
    user,
  };
}

/**
 * Hook to check if current user is admin (without redirecting)
 */
export function useIsAdmin() {
  const { user } = useAuthStore();
  return user?.roles.includes(UserRole.PLATFORM_ADMIN) || false;
}
