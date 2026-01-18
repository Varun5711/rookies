/**
 * Analytics API Client
 * Handles all analytics and dashboard API calls
 */

import { DashboardStats, TrendData, ServiceHealth } from '@/lib/types/analytics';

const BASE_URL = '/api/services/analytics';

/**
 * Get authentication token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

/**
 * Create headers with authorization
 */
function createHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred',
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

/**
 * Get dashboard overview statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${BASE_URL}/admin/analytics/overview`, {
    method: 'GET',
    headers: createHeaders(),
  });
  return handleResponse<DashboardStats>(response);
}

/**
 * Get trend data for specified number of days
 */
export async function getTrends(days = 7): Promise<TrendData[]> {
  const response = await fetch(`${BASE_URL}/admin/analytics/trends?days=${days}`, {
    method: 'GET',
    headers: createHeaders(),
  });
  return handleResponse<TrendData[]>(response);
}

/**
 * Get service health status for all services
 */
export async function getServiceHealth(): Promise<ServiceHealth[]> {
  const response = await fetch(`${BASE_URL}/admin/analytics/service-health`, {
    method: 'GET',
    headers: createHeaders(),
  });
  return handleResponse<ServiceHealth[]>(response);
}

/**
 * Fetch all dashboard data in parallel
 */
export async function getAllDashboardData() {
  const [stats, trends, health] = await Promise.allSettled([
    getDashboardStats(),
    getTrends(7),
    getServiceHealth(),
  ]);

  return {
    stats: stats.status === 'fulfilled' ? stats.value : null,
    trends: trends.status === 'fulfilled' ? trends.value : [],
    health: health.status === 'fulfilled' ? health.value : [],
    errors: {
      stats: stats.status === 'rejected' ? stats.reason?.message : null,
      trends: trends.status === 'rejected' ? trends.reason?.message : null,
      health: health.status === 'rejected' ? health.reason?.message : null,
    },
  };
}
