'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Server,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { adminApi } from '@/lib/api/admin';
import { AdminGuard } from '@/components/guards/AdminGuard';

// Helper function to extract port from URL
const extractPortFromUrl = (url: string): number => {
  try {
    const urlObj = new URL(url);
    return parseInt(urlObj.port) || (urlObj.protocol === 'https:' ? 443 : 80);
  } catch {
    return 0;
  }
};

function ServicesContent() {
  const { data: services, isLoading, refetch } = useQuery({
    queryKey: ['adminServices'],
    queryFn: () => adminApi.getServices(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  // Map backend service data to UI format
  const serviceList = services?.map((service: any) => ({
    name: service.displayName || service.name,
    status: service.healthStatus.toLowerCase(), // "HEALTHY" -> "healthy"
    port: extractPortFromUrl(service.baseUrl),
    uptime: 'N/A', // Not available in current backend schema
    responseTime: 'N/A', // Not available in current backend schema
  })) || [];

  const healthyCount = serviceList.filter((s: { status: string }) => s.status === 'healthy').length;
  const degradedCount = serviceList.filter((s: { status: string }) => s.status === 'degraded').length;
  const downCount = serviceList.filter((s: { status: string }) => s.status === 'down').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Service Registry</h1>
          <p className="text-slate-500 mt-1">Monitor and manage microservices</p>
        </div>
        <Button
          variant="outline"
          leftIcon={<RefreshCw size={18} />}
          onClick={() => refetch()}
        >
          Refresh Status
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{healthyCount}</p>
              <p className="text-sm text-slate-500">Healthy Services</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{degradedCount}</p>
              <p className="text-sm text-slate-500">Degraded Services</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <XCircle className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{downCount}</p>
              <p className="text-sm text-slate-500">Down Services</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server size={20} className="text-blue-600" />
            Registered Services
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Port
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Uptime
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Response Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {serviceList.map((service: {
                  name: string;
                  status: string;
                  port: number;
                  uptime: string;
                  responseTime: string;
                }) => (
                  <tr key={service.name} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Server className="text-slate-600" size={18} />
                        </div>
                        <span className="font-medium text-slate-900">{service.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4 text-slate-600">{service.port}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Activity size={14} className="text-green-500" />
                        <span className="text-slate-600">{service.uptime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{service.responseTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

export default function ServicesPage() {
  return (
    <AdminGuard>
      <ServicesContent />
    </AdminGuard>
  );
}
