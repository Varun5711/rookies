'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  Building2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { urbanApi } from '@/lib/api/urban';
import {
  GRIEVANCE_STATUS_LABELS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  GrievanceStatus
} from '@/lib/types/urban';
import { formatDate, formatDateTime } from '@/lib/utils/formatDate';

const statusTimeline: GrievanceStatus[] = [
  'submitted',
  'acknowledged',
  'in_progress',
  'resolved',
  'closed'
];

export default function GrievanceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const [escalateModal, setEscalateModal] = React.useState(false);
  const [escalateReason, setEscalateReason] = React.useState('');

  const { data: grievance, isLoading } = useQuery({
    queryKey: ['grievance', id],
    queryFn: () => urbanApi.getGrievance(id),
  });

  const escalateMutation = useMutation({
    mutationFn: () => urbanApi.escalateGrievance(id, escalateReason),
    onSuccess: () => {
      toast.success('Grievance escalated successfully');
      queryClient.invalidateQueries({ queryKey: ['grievance', id] });
      setEscalateModal(false);
      setEscalateReason('');
    },
    onError: () => {
      toast.error('Failed to escalate grievance');
    },
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!grievance) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-900">Grievance not found</h2>
        <Link href="/urban/grievances" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to grievances
        </Link>
      </div>
    );
  }

  const currentStatusIndex = statusTimeline.indexOf(grievance.status as GrievanceStatus);
  const canEscalate = ['in_progress', 'pending_info'].includes(grievance.status) &&
    !grievance.escalatedAt;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/urban/grievances" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
        <ArrowLeft size={18} />
        <span>Back to Grievances</span>
      </Link>

      {/* Grievance Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="text-orange-600" size={40} />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <StatusBadge status={grievance.status} />
                <Badge className={PRIORITY_COLORS[grievance.priority]}>
                  {PRIORITY_LABELS[grievance.priority]}
                </Badge>
                {grievance.escalatedAt && (
                  <Badge variant="danger">Escalated</Badge>
                )}
              </div>

              <h1 className="text-2xl font-bold text-slate-900 mb-2">{grievance.title}</h1>
              <p className="text-slate-600">{grievance.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                    <Calendar className="text-slate-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Filed On</p>
                    <p className="text-sm font-medium text-slate-900">{formatDate(grievance.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                    <Clock className="text-slate-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Due Date</p>
                    <p className="text-sm font-medium text-slate-900">{formatDate(grievance.dueDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                    <Building2 className="text-slate-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Department</p>
                    <p className="text-sm font-medium text-slate-900">
                      {grievance.assignedDepartment || grievance.category?.department || 'Not assigned'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Status Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            {statusTimeline.map((status, index) => {
              const isCompleted = currentStatusIndex >= index;
              const isCurrent = currentStatusIndex === index;
              const isLast = index === statusTimeline.length - 1;

              return (
                <React.Fragment key={status}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span className={`text-xs mt-2 text-center ${
                      isCompleted || isCurrent ? 'text-slate-900 font-medium' : 'text-slate-400'
                    }`}>
                      {GRIEVANCE_STATUS_LABELS[status]}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded ${
                        currentStatusIndex > index ? 'bg-green-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Location & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-slate-500">Address</p>
              <p className="text-sm text-slate-900">{grievance.address}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Location</p>
              <p className="text-sm text-slate-900">{grievance.location}</p>
            </div>
            {grievance.ward && (
              <div>
                <p className="text-xs text-slate-500">Ward</p>
                <p className="text-sm text-slate-900">{grievance.ward}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-slate-500">Pincode</p>
              <p className="text-sm text-slate-900">{grievance.pincode}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone size={20} className="text-green-600" />
              Complainant Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-slate-500">Name</p>
              <p className="text-sm text-slate-900">{grievance.complainantName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Mobile</p>
              <p className="text-sm text-slate-900">{grievance.complainantMobile}</p>
            </div>
            {grievance.complainantEmail && (
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm text-slate-900">{grievance.complainantEmail}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Escalation Info */}
      {grievance.escalatedAt && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium text-red-900">Grievance Escalated</h4>
                <p className="text-sm text-red-700 mt-1">
                  Escalated on {formatDateTime(grievance.escalatedAt)}
                </p>
                {grievance.escalationReason && (
                  <p className="text-sm text-red-700 mt-1">
                    Reason: {grievance.escalationReason}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {canEscalate && (
        <div className="flex justify-center">
          <Button
            variant="danger"
            leftIcon={<AlertTriangle size={18} />}
            onClick={() => setEscalateModal(true)}
          >
            Escalate Grievance
          </Button>
        </div>
      )}

      {/* Escalate Modal */}
      <Modal
        isOpen={escalateModal}
        onClose={() => {
          setEscalateModal(false);
          setEscalateReason('');
        }}
        title="Escalate Grievance"
      >
        <p className="text-slate-600 mb-4">
          Escalating this grievance will notify senior officials. Please provide a reason for escalation.
        </p>
        <Textarea
          label="Reason for escalation"
          placeholder="Explain why you want to escalate this grievance..."
          value={escalateReason}
          onChange={(e) => setEscalateReason(e.target.value)}
          required
        />
        <ModalFooter>
          <Button variant="outline" onClick={() => setEscalateModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            isLoading={escalateMutation.isPending}
            onClick={() => escalateMutation.mutate()}
            disabled={!escalateReason.trim()}
          >
            Escalate
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
