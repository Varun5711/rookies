'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
      hasHydrated: false,
      setAuth: (user, accessToken, refreshToken) => {
        // Ensure user has roles array
        const userWithRoles = {
          ...user,
          roles: user.roles && Array.isArray(user.roles) ? user.roles : [],
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);
        }
        set({
          user: userWithRoles,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          hasHydrated: true,
        });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          hasHydrated: true,
        });
      },
      setLoading: (loading) => set({ isLoading: loading }),
      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated, isLoading: !hasHydrated });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Mark as hydrated when rehydration is complete
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
