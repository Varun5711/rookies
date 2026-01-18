'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  Calendar,
  MapPin,
  Clock,
  Plus,
  Filter
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { urbanApi } from '@/lib/api/urban';
import {
  Grievance,
  GRIEVANCE_STATUS_LABELS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  GrievanceStatus,
  Priority
} from '@/lib/types/urban';
import { formatDate, formatRelativeTime } from '@/lib/utils/formatDate';

export default function GrievancesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['myGrievances', page, status, priority],
    queryFn: () => urbanApi.getMyGrievances({ page, limit: 10, status, priority }),
  });

  const grievances = data?.data || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0, limit: 10 };

  const statusOptions = Object.entries(GRIEVANCE_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const priorityOptions = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Grievances</h1>
          <p className="text-slate-500 mt-1">Track and manage your submitted grievances</p>
        </div>
        <Link href="/urban/grievances/new">
          <Button leftIcon={<Plus size={18} />}>
            Submit Grievance
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            placeholder="All Statuses"
            options={[{ value: '', label: 'All Statuses' }, ...statusOptions]}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <Select
            placeholder="All Priorities"
            options={[{ value: '', label: 'All Priorities' }, ...priorityOptions]}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          />
        </div>
      </div>

      {/* Grievances List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : grievances.length === 0 ? (
        <EmptyState
          icon={<AlertCircle size={32} />}
          title="No grievances found"
          description="Submit a grievance to report civic issues"
          action={{
            label: 'Submit Grievance',
            onClick: () => {},
          }}
        />
      ) : (
        <>
          <div className="space-y-4">
            {grievances.map((grievance: Grievance) => (
              <GrievanceCard key={grievance.id} grievance={grievance} />
            ))}
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

function GrievanceCard({ grievance }: { grievance: Grievance }) {
  return (
    <Card hover>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="text-orange-600" size={24} />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <StatusBadge status={grievance.status} />
                <Badge className={PRIORITY_COLORS[grievance.priority]}>
                  {PRIORITY_LABELS[grievance.priority]}
                </Badge>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-1">{grievance.title}</h3>

              <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                {grievance.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{grievance.location}, {grievance.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Filed: {formatDate(grievance.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>Due: {formatDate(grievance.dueDate)}</span>
                </div>
              </div>

              {grievance.category && (
                <div className="mt-3">
                  <Badge variant="default">{grievance.category.name}</Badge>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link href={`/urban/grievances/${grievance.id}`}>
              <Button variant="outline" size="sm" className="w-full">
                Track Status
              </Button>
            </Link>
            <p className="text-xs text-slate-400 text-center">
              {formatRelativeTime(grievance.updatedAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
