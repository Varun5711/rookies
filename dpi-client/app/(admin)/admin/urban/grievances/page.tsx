'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Search, AlertCircle, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { adminApi } from '@/lib/api/admin';
import {
  Grievance,
  GRIEVANCE_STATUS_LABELS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  GrievanceStatus
} from '@/lib/types/urban';
import { formatDate } from '@/lib/utils/formatDate';

export default function AdminGrievancesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminGrievances', page, status, priority],
    queryFn: () => adminApi.getAllGrievances({ page, limit: 10, status, priority }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.updateGrievanceStatus(id, { status }),
    onSuccess: () => {
      toast.success('Status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['adminGrievances'] });
      setUpdateStatusModal(false);
      setSelectedGrievance(null);
      setNewStatus('');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
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

  const columns = [
    {
      key: 'title',
      header: 'Grievance',
      render: (item: Grievance) => (
        <div className="max-w-xs">
          <p className="font-medium text-slate-900 truncate">{item.title}</p>
          <p className="text-xs text-slate-500">{item.category?.name || 'Uncategorized'}</p>
        </div>
      ),
    },
    {
      key: 'complainant',
      header: 'Complainant',
      render: (item: Grievance) => (
        <div>
          <p className="text-slate-900">{item.complainantName}</p>
          <p className="text-xs text-slate-500">{item.complainantMobile}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Grievance) => <StatusBadge status={item.status} />,
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (item: Grievance) => (
        <Badge className={PRIORITY_COLORS[item.priority]}>
          {PRIORITY_LABELS[item.priority]}
        </Badge>
      ),
    },
    {
      key: 'date',
      header: 'Filed On',
      render: (item: Grievance) => (
        <span className="text-slate-600 text-sm">{formatDate(item.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Grievance) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedGrievance(item);
              setNewStatus(item.status);
              setUpdateStatusModal(true);
            }}
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-green-600"
            onClick={() => {
              setSelectedGrievance(item);
              setNewStatus('resolved');
              updateStatusMutation.mutate({ id: item.id, status: 'resolved' });
            }}
          >
            <CheckCircle2 size={16} />
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
      <div>
        <h1 className="text-2xl font-bold text-slate-900">All Grievances</h1>
        <p className="text-slate-500 mt-1">Manage and resolve citizen grievances</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search grievances..."
              leftIcon={<Search size={18} />}
            />
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
        </CardContent>
      </Card>

      {/* Table */}
      <Table
        columns={columns}
        data={grievances}
        keyExtractor={(item) => item.id}
        emptyMessage="No grievances found"
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

      {/* Update Status Modal */}
      <Modal
        isOpen={updateStatusModal}
        onClose={() => {
          setUpdateStatusModal(false);
          setSelectedGrievance(null);
          setNewStatus('');
        }}
        title="Update Grievance Status"
        size="md"
      >
        {selectedGrievance && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-slate-900">{selectedGrievance.title}</h4>
              <p className="text-sm text-slate-500 mt-1">{selectedGrievance.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Complainant</p>
                <p className="font-medium text-slate-900">{selectedGrievance.complainantName}</p>
              </div>
              <div>
                <p className="text-slate-500">Current Status</p>
                <StatusBadge status={selectedGrievance.status} />
              </div>
            </div>
            <Select
              label="New Status"
              options={statusOptions}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            />
          </div>
        )}
        <ModalFooter>
          <Button variant="outline" onClick={() => setUpdateStatusModal(false)}>
            Cancel
          </Button>
          <Button
            isLoading={updateStatusMutation.isPending}
            onClick={() => {
              if (selectedGrievance && newStatus) {
                updateStatusMutation.mutate({
                  id: selectedGrievance.id,
                  status: newStatus,
                });
              }
            }}
          >
            Update Status
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
