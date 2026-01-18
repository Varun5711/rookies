'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { FileText, Calendar, Clock, CheckCircle2, XCircle, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { agricultureApi } from '@/lib/api/agriculture';
import { SchemeApplication, APPLICATION_STATUS_LABELS } from '@/lib/types/agriculture';
import { formatDate } from '@/lib/utils/formatDate';

export default function MyApplicationsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['myApplications', page],
    queryFn: () => agricultureApi.getMyApplications({ page, limit: 10 }),
  });

  const applications = data?.data || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0, limit: 10 };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'disbursed':
        return <CheckCircle2 className="text-green-600" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-600" size={20} />;
      default:
        return <Clock className="text-yellow-600" size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
          <p className="text-slate-500 mt-1">Track your scheme applications</p>
        </div>
        <Link href="/agriculture/schemes">
          <Button leftIcon={<Plus size={18} />}>
            Apply for Scheme
          </Button>
        </Link>
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={<FileText size={32} />}
          title="No applications yet"
          description="Start by applying for an agriculture scheme"
          action={{
            label: 'Browse Schemes',
            onClick: () => {},
          }}
        />
      ) : (
        <>
          <div className="space-y-4">
            {applications.map((application: SchemeApplication) => (
              <ApplicationCard key={application.id} application={application} getStatusIcon={getStatusIcon} />
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

function ApplicationCard({
  application,
  getStatusIcon,
}: {
  application: SchemeApplication;
  getStatusIcon: (status: string) => React.ReactNode;
}) {
  return (
    <Card hover>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="text-green-600" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-slate-900">
                  {application.scheme?.name || 'Scheme Application'}
                </h3>
                <StatusBadge status={application.status} />
              </div>

              <p className="text-sm text-slate-500 mb-2">
                Application ID: {application.id.slice(0, 8).toUpperCase()}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Applied: {formatDate(application.createdAt)}</span>
                </div>
                {application.updatedAt !== application.createdAt && (
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>Updated: {formatDate(application.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(application.status)}
              <span className="text-sm font-medium text-slate-700">
                {APPLICATION_STATUS_LABELS[application.status]}
              </span>
            </div>
            <Link href={`/agriculture/schemes/applications/${application.id}`}>
              <Button variant="outline" size="sm">
                Track Status
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress Bar for Disbursed */}
        {application.status === 'disbursed' && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 size={16} />
              <span className="text-sm font-medium">Benefit amount has been disbursed to your account</span>
            </div>
          </div>
        )}

        {/* Progress Bar for Under Review */}
        {application.status === 'under_review' && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-slate-500">Application Progress</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-2/3 transition-all" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
