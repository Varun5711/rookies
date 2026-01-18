'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { AdminGuard } from '@/components/guards/AdminGuard';
import { FileText, Search, User, Activity, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatDate';

const EVENT_TYPES = [
  { value: '', label: 'All Events' },
  { value: 'user.login', label: 'User Login' },
  { value: 'user.logout', label: 'User Logout' },
  { value: 'user.register', label: 'User Register' },
  { value: 'appointment.create', label: 'Appointment Create' },
  { value: 'appointment.cancel', label: 'Appointment Cancel' },
  { value: 'grievance.create', label: 'Grievance Create' },
  { value: 'scheme.apply', label: 'Scheme Apply' },
];

function AuditLogsContent() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    eventType: '',
    search: '',
  });

  const { data: stats } = useQuery({
    queryKey: ['auditStats'],
    queryFn: () => auditApi.getStats(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['auditLogs', page, filters],
    queryFn: () =>
      auditApi.getAllLogs({
        page,
        limit: 20,
        eventType: filters.eventType || undefined,
      }),
  });

  const logs = data?.data || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0, limit: 20 };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
        <p className="text-slate-500 mt-1">
          Monitor all platform activity and events
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalEvents?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-slate-500">Total Events</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <User className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.uniqueUsers?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-slate-500">Unique Users</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Activity className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.recentActivity?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-slate-500">Last 24h</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Calendar className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.eventsByType?.length || 0}
                </p>
                <p className="text-sm text-slate-500">Event Types</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Search by user ID or resource..."
            leftIcon={<Search size={18} />}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Select
            options={EVENT_TYPES}
            value={filters.eventType}
            onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
          />
        </div>
      </Card>

      {/* Logs Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          icon={<FileText size={48} />}
          title="No audit logs found"
          description="No activity matches your filters"
        />
      ) : (
        <>
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Resource
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {logs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="info">{log.eventType}</Badge>
                          <span className="text-sm text-slate-600">{log.action}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-slate-900">
                            {log.userName || 'Unknown'}
                          </div>
                          <div className="text-slate-500">{log.userId.slice(0, 8)}...</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-900">{log.serviceName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-slate-600">
                          {log.resource}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500">
                          {formatDate(log.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {meta.totalPages > 1 && (
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              total={meta.total}
              limit={meta.limit}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function AuditLogsPage() {
  return (
    <AdminGuard>
      <AuditLogsContent />
    </AdminGuard>
  );
}
