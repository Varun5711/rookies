'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, Building2, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { healthcareApi } from '@/lib/api/healthcare';
import { Hospital } from '@/lib/types/healthcare';

export default function AdminHospitalsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['adminHospitals', page, search],
    queryFn: () => healthcareApi.getHospitals({ page, limit: 10, search }),
  });

  const hospitals = data?.data || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0, limit: 10 };

  const columns = [
    {
      key: 'name',
      header: 'Hospital',
      render: (item: Hospital) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Building2 className="text-blue-600" size={18} />
          </div>
          <div>
            <p className="font-medium text-slate-900">{item.name}</p>
            <p className="text-xs text-slate-500">{item.city}, {item.state}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (item: Hospital) => (
        <Badge variant={item.type === 'government' ? 'info' : 'secondary'}>
          {item.type}
        </Badge>
      ),
    },
    {
      key: 'beds',
      header: 'Beds',
      render: (item: Hospital) => (
        <span className="text-slate-600">{item.availableBeds}/{item.totalBeds}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Hospital) => (
        <Badge variant={item.isActive ? 'success' : 'default'}>
          {item.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Hospital) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/healthcare/hospitals/${item.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit size={16} />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Hospitals</h1>
          <p className="text-slate-500 mt-1">Add, edit, and manage hospital listings</p>
        </div>
        <Link href="/admin/healthcare/hospitals/new">
          <Button leftIcon={<Plus size={18} />}>
            Add Hospital
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search hospitals..."
            leftIcon={<Search size={18} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Table
        columns={columns}
        data={hospitals}
        keyExtractor={(item) => item.id}
        emptyMessage="No hospitals found"
      />

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={meta.limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
