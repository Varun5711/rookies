'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { getAllDashboardData } from '@/lib/api/analytics';
import { DashboardStats, TrendData, ServiceHealth } from '@/lib/types/analytics';
import { RefreshCw, Activity, AlertCircle, CheckCircle, Clock, TrendingUp, Users, Calendar, FileText, MessageSquare } from 'lucide-react';
import { AdminGuard } from '@/components/guards/AdminGuard';

const REFRESH_INTERVAL = 30000; // 30 seconds

function DashboardContent() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [trends, setTrends] = useState<TrendData[]>([]);
    const [health, setHealth] = useState<ServiceHealth[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const { user } = useAuthStore();

    const fetchData = useCallback(async (showRefreshing = false) => {
        if (showRefreshing) setRefreshing(true);
        try {
            const data = await getAllDashboardData();

            if (data.stats) setStats(data.stats);
            if (data.trends) setTrends(data.trends);
            if (data.health) setHealth(data.health);
            setErrors(data.errors);
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
            setErrors({ general: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => fetchData(true), REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleRefresh = () => {
        fetchData(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700" />
                    <p className="text-sm text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Welcome back, <span className="font-semibold">{user?.fullName || 'Admin'}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Last updated</p>
                        <p className="text-sm font-medium text-gray-700">
                            {lastUpdate.toLocaleTimeString()}
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Error Banner - Show any errors */}
            {(errors.general || errors.stats || errors.trends || errors.health) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="font-medium text-yellow-900 mb-2">Some data could not be loaded</p>
                            <div className="space-y-1 text-sm text-yellow-800">
                                {errors.general && <p>• General: {errors.general}</p>}
                                {errors.stats && <p>• Statistics: {errors.stats}</p>}
                                {errors.trends && <p>• Trends: {errors.trends}</p>}
                                {errors.health && <p>• Service Health: {errors.health}</p>}
                            </div>
                            <p className="text-xs text-yellow-700 mt-2">
                                This might be due to services not being available. The dashboard will continue to show available data.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Users"
                    value={stats?.total_users || 0}
                    icon={<Users className="h-5 w-5" />}
                    color="blue"
                    loading={!stats && !errors.stats}
                />
                <StatCard
                    title="Appointments"
                    value={stats?.total_appointments || 0}
                    icon={<Calendar className="h-5 w-5" />}
                    color="green"
                    loading={!stats && !errors.stats}
                />
                <StatCard
                    title="Applications"
                    value={stats?.total_applications || 0}
                    icon={<FileText className="h-5 w-5" />}
                    color="purple"
                    loading={!stats && !errors.stats}
                />
                <StatCard
                    title="Grievances"
                    value={stats?.total_grievances || 0}
                    icon={<MessageSquare className="h-5 w-5" />}
                    color="red"
                    loading={!stats && !errors.stats}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Service Health */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="h-5 w-5 text-gray-700" />
                        <h2 className="text-lg font-semibold text-gray-900">Service Health</h2>
                    </div>
                    {errors.health ? (
                        <div className="text-sm text-red-600">{errors.health}</div>
                    ) : health.length === 0 ? (
                        <div className="text-sm text-gray-500">Loading service health...</div>
                    ) : (
                        <div className="space-y-3">
                            {health.map((service) => (
                                <ServiceHealthItem key={service.name} service={service} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Activity Trends */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-gray-700" />
                        <h2 className="text-lg font-semibold text-gray-900">Activity Trends (7 Days)</h2>
                    </div>
                    {errors.trends ? (
                        <div className="text-sm text-red-600">{errors.trends}</div>
                    ) : trends.length === 0 ? (
                        <div className="text-sm text-gray-500">No trend data available</div>
                    ) : (
                        <div className="space-y-2">
                            {trends.slice(0, 7).map((trend, idx) => (
                                <TrendItem key={trend.date} trend={trend} isLatest={idx === 0} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Appointment Stats */}
                {stats?.appointment_stats && stats.appointment_stats.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointments by Status</h2>
                        <div className="space-y-3">
                            {stats.appointment_stats.map((stat) => (
                                <div key={stat.status} className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700 capitalize">
                                        {stat.status.replace(/_/g, ' ').toLowerCase()}
                                    </span>
                                    <span className="text-lg font-semibold text-gray-900">
                                        {stat.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                        <QuickActionButton href="/admin/appointments">
                            View All Appointments
                        </QuickActionButton>
                        <QuickActionButton href="/admin/applications">
                            Manage Applications
                        </QuickActionButton>
                        <QuickActionButton href="/admin/grievances">
                            Review Grievances
                        </QuickActionButton>
                        <QuickActionButton href="/admin/users">
                            User Management
                        </QuickActionButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Stat Card Component
function StatCard({
    title,
    value,
    icon,
    color,
    loading
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'purple' | 'red';
    loading?: boolean;
}) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-700',
        green: 'bg-green-50 text-green-700',
        purple: 'bg-purple-50 text-purple-700',
        red: 'bg-red-50 text-red-700',
    };

    const borderClasses = {
        blue: 'border-blue-200',
        green: 'border-green-200',
        purple: 'border-purple-200',
        red: 'border-red-200',
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm border ${borderClasses[color]} p-6 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
            </div>
        </div>
    );
}

// Service Health Item
function ServiceHealthItem({ service }: { service: ServiceHealth }) {
    const isHealthy = service.status === 'healthy';
    const statusColor = isHealthy ? 'text-green-600' : 'text-red-600';
    const bgColor = isHealthy ? 'bg-green-50' : 'bg-red-50';
    const borderColor = isHealthy ? 'border-green-200' : 'border-red-200';

    return (
        <div className={`flex items-center justify-between p-3 rounded-lg border ${borderColor} ${bgColor}`}>
            <div className="flex items-center gap-3">
                {isHealthy ? (
                    <CheckCircle className={`h-5 w-5 ${statusColor}`} />
                ) : (
                    <AlertCircle className={`h-5 w-5 ${statusColor}`} />
                )}
                <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    {service.error && (
                        <p className="text-xs text-red-600">{service.error}</p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {service.uptime !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="h-3 w-3" />
                        {Math.floor(service.uptime / 60)}m
                    </div>
                )}
                <span className={`text-sm font-medium capitalize ${statusColor}`}>
                    {service.status}
                </span>
            </div>
        </div>
    );
}

// Trend Item
function TrendItem({ trend, isLatest }: { trend: TrendData; isLatest: boolean }) {
    const date = new Date(trend.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className={`flex items-center justify-between p-3 rounded-lg ${isLatest ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
            <div>
                <p className="text-sm font-medium text-gray-900">{formattedDate}</p>
                <p className="text-xs text-gray-600">{trend.unique_services} services active</p>
            </div>
            <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">{trend.events}</p>
                <p className="text-xs text-gray-600">events</p>
            </div>
        </div>
    );
}

// Quick Action Button
function QuickActionButton({ children, href }: { children: React.ReactNode; href: string }) {
    return (
        <a
            href={href}
            className="block w-full px-4 py-2.5 text-left text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
            {children}
        </a>
    );
}

// Export with Admin Guard
export default function DashboardPage() {
    return (
        <AdminGuard>
            <DashboardContent />
        </AdminGuard>
    );
}
