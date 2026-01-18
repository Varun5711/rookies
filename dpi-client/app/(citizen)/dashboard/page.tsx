'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  CalendarDays,
  FileText,
  AlertCircle,
  Heart,
  Leaf,
  Building,
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { useAuthStore } from '@/lib/store/authStore';
import { UserRole } from '@/lib/types/auth';
import { citizenApi } from '@/lib/api/citizen';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  // Fetch citizen stats and recent activity
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['citizenStats'],
    queryFn: () => citizenApi.getDashboardStats(),
    refetchInterval: 60000, // 1 minute
    retry: 2,
  });

  const { data: recentActivityData, isLoading: activityLoading } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: () => citizenApi.getRecentActivity(3),
    refetchInterval: 60000,
    retry: 2,
  });

  // ✅ BLOCK ADMINS - Redirect to admin dashboard
  useEffect(() => {
    if (user?.roles.includes(UserRole.PLATFORM_ADMIN)) {
      router.replace('/admin/dashboard');
    }
  }, [user, router]);

  const quickStats = [
    {
      label: 'Active Appointments',
      value: stats?.activeAppointments?.toString() || '0',
      icon: <CalendarDays className="text-blue-600" size={24} />,
      href: '/healthcare/appointments',
      color: 'bg-blue-50',
    },
    {
      label: 'Pending Applications',
      value: stats?.pendingApplications?.toString() || '0',
      icon: <FileText className="text-green-600" size={24} />,
      href: '/agriculture/my-applications',
      color: 'bg-green-50',
    },
    {
      label: 'Open Grievances',
      value: stats?.openGrievances?.toString() || '0',
      icon: <AlertCircle className="text-orange-600" size={24} />,
      href: '/urban/grievances',
      color: 'bg-orange-50',
    },
  ];

  const quickActions = [
    {
      label: 'Book Appointment',
      description: 'Schedule a doctor visit',
      icon: <Heart className="text-blue-600" size={24} />,
      href: '/healthcare/appointments/book',
      color: 'bg-blue-50',
    },
    {
      label: 'Apply for Scheme',
      description: 'Explore agriculture schemes',
      icon: <Leaf className="text-green-600" size={24} />,
      href: '/agriculture/schemes',
      color: 'bg-green-50',
    },
    {
      label: 'Submit Grievance',
      description: 'Report civic issues',
      icon: <Building className="text-orange-600" size={24} />,
      href: '/urban/grievances/new',
      color: 'bg-orange-50',
    },
  ];

  // Map activity type to icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <CalendarDays className="text-blue-600" size={18} />;
      case 'application':
        return <FileText className="text-green-600" size={18} />;
      case 'grievance':
        return <AlertCircle className="text-orange-600" size={18} />;
      default:
        return <Clock className="text-slate-600" size={18} />;
    }
  };

  // Calculate relative time
  const getRelativeTime = (timestamp: string) => {
    const now = new Date().getTime();
    const then = new Date(timestamp).getTime();
    const diff = now - then;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  const recentActivity = (recentActivityData || []).map((activity) => ({
    id: activity.id,
    title: activity.title,
    description: activity.description,
    time: getRelativeTime(activity.timestamp),
    status: activity.status,
    icon: getActivityIcon(activity.type),
  }));

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.fullName || 'Citizen'}!
        </h1>
        <p className="text-blue-100">
          Access all government services from your unified dashboard.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card hover className="h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Card hover className="h-full">
                <CardContent className="py-6">
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                    {action.icon}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{action.label}</h3>
                  <p className="text-sm text-slate-500 mb-4">{action.description}</p>
                  <span className="inline-flex items-center text-sm font-medium text-blue-600">
                    Get Started <ArrowRight size={16} className="ml-1" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="divide-y divide-slate-100 p-0">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-medium text-slate-900">{activity.title}</h4>
                    <StatusBadge status={activity.status} />
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{activity.description}</p>
                  <p className="text-xs text-slate-400 mt-2">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm">
            View All Activity
          </Button>
        </div>
      </div>
    </div>
  );
}
