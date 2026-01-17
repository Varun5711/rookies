'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  CalendarDays,
  FileText,
  AlertCircle,
  Server,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { adminApi } from '@/lib/api/admin';

export default function AdminDashboardPage() {
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['adminServices'],
    queryFn: () => adminApi.getServices(),
  });

  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ['platformHealth'],
    queryFn: () => adminApi.getPlatformHealth(),
  });

  if (servicesLoading || healthLoading) {
    return <PageSkeleton />;
  }

  const stats = [
    {
      label: 'Total Users',
      value: '12,458',
      change: '+12%',
      icon: <Users className="text-blue-600" size={24} />,
      color: 'bg-blue-50',
    },
    {
      label: 'Appointments Today',
      value: '156',
      change: '+5%',
      icon: <CalendarDays className="text-green-600" size={24} />,
      color: 'bg-green-50',
    },
    {
      label: 'Pending Applications',
      value: '342',
      change: '-8%',
      icon: <FileText className="text-orange-600" size={24} />,
      color: 'bg-orange-50',
    },
    {
      label: 'Open Grievances',
      value: '89',
      change: '-15%',
      icon: <AlertCircle className="text-red-600" size={24} />,
      color: 'bg-red-50',
    },
  ];

  const serviceList = services || [
    { name: 'API Gateway', status: 'healthy', port: 3000 },
    { name: 'Auth Service', status: 'healthy', port: 3001 },
    { name: 'Healthcare', status: 'healthy', port: 3003 },
    { name: 'Agriculture', status: 'healthy', port: 3004 },
    { name: 'Urban', status: 'healthy', port: 3005 },
    { name: 'Notification', status: 'degraded', port: 3006 },
  ];

  const recentActivity = [
    { id: 1, action: 'New hospital registered', user: 'Admin', time: '10 minutes ago', type: 'create' },
    { id: 2, action: 'Scheme application approved', user: 'Reviewer', time: '25 minutes ago', type: 'approve' },
    { id: 3, action: 'Grievance escalated', user: 'System', time: '1 hour ago', type: 'escalate' },
    { id: 4, action: 'Doctor profile updated', user: 'Admin', time: '2 hours ago', type: 'update' },
    { id: 5, action: 'New user registered', user: 'System', time: '3 hours ago', type: 'create' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp
                    size={14}
                    className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}
                  />
                  <span
                    className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server size={20} className="text-blue-600" />
              Service Health
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {serviceList.map((service: { name: string; status: string; port: number }) => (
                <div key={service.name} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {service.status === 'healthy' ? (
                      <CheckCircle2 className="text-green-500" size={18} />
                    ) : service.status === 'degraded' ? (
                      <Clock className="text-yellow-500" size={18} />
                    ) : (
                      <XCircle className="text-red-500" size={18} />
                    )}
                    <div>
                      <p className="font-medium text-slate-900">{service.name}</p>
                      <p className="text-xs text-slate-500">Port {service.port}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      service.status === 'healthy'
                        ? 'success'
                        : service.status === 'degraded'
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    {service.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'create'
                        ? 'bg-green-100'
                        : activity.type === 'approve'
                        ? 'bg-blue-100'
                        : activity.type === 'escalate'
                        ? 'bg-red-100'
                        : 'bg-slate-100'
                    }`}
                  >
                    {activity.type === 'create' ? (
                      <CheckCircle2 className="text-green-600" size={14} />
                    ) : activity.type === 'approve' ? (
                      <CheckCircle2 className="text-blue-600" size={14} />
                    ) : activity.type === 'escalate' ? (
                      <AlertCircle className="text-red-600" size={14} />
                    ) : (
                      <Clock className="text-slate-600" size={14} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                    <p className="text-xs text-slate-500">
                      by {activity.user} &bull; {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction
              icon={<Users size={20} />}
              label="Add Hospital"
              href="/admin/healthcare/hospitals/new"
            />
            <QuickAction
              icon={<CalendarDays size={20} />}
              label="View Appointments"
              href="/admin/healthcare/appointments"
            />
            <QuickAction
              icon={<FileText size={20} />}
              label="Manage Schemes"
              href="/admin/agriculture/schemes"
            />
            <QuickAction
              icon={<AlertCircle size={20} />}
              label="View Grievances"
              href="/admin/urban/grievances"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
    >
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <span className="text-sm font-medium text-slate-700 text-center">{label}</span>
    </a>
  );
}
