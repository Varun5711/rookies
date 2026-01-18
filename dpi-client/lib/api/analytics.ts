/**
 * Analytics API Client
 * Handles all analytics and dashboard API calls
 */

import apiClient from './client';
import {
  DashboardStats,
  TrendData,
  ServiceHealth,
} from '@/lib/types/analytics';

/**
 * Get dashboard overview statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get('/admin/analytics/overview');
  return response.data.data;
}

/**
 * Get trend data for specified number of days
 */
export async function getTrends(days = 7): Promise<TrendData[]> {
  const response = await apiClient.get(`/admin/analytics/trends?days=${days}`);
  return response.data.data;
}

/**
 * Get service health status for all services
 */
export async function getServiceHealth(): Promise<ServiceHealth[]> {
  const response = await apiClient.get('/admin/analytics/service-health');
  return response.data.data;
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
