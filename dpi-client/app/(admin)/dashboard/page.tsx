'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        async function fetchStats() {
            try {
                const token = localStorage.getItem('access_token');
                const res = await fetch('/api/services/audit/admin/analytics/overview', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                <p className="text-gray-600">Welcome back, <span className="font-semibold text-gray-900">{user?.full_name || 'Admin'}</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Users" value={stats?.total_users || 0} color="blue" />
                <StatCard title="Grievances" value={stats?.total_grievances || 0} color="red" />
                <StatCard title="Appointments" value={stats?.total_appointments || 0} color="green" />
                <StatCard title="Applications" value={stats?.total_applications || 0} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-md text-sm text-blue-600 font-medium">
                            View Pending Approvals
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-md text-sm text-blue-600 font-medium">
                            Manage Service Providers
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-md text-sm text-blue-600 font-medium">
                            System Health Check
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, color }: { title: string; value: number, color: string }) {
    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-700',
        red: 'bg-red-50 text-red-700',
        green: 'bg-green-50 text-green-700',
        purple: 'bg-purple-50 text-purple-700',
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-semibold text-gray-900">{value}</p>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}>
                    +0%
                </span>
            </div>
        </div>
    );
}
