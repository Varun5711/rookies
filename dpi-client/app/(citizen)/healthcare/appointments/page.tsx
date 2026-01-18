'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  CalendarDays,
  Clock,
  Stethoscope,
  Building2,
  Plus,
  X
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { healthcareApi } from '@/lib/api/healthcare';
import { Appointment, SPECIALIZATION_LABELS } from '@/lib/types/healthcare';
import { formatDate, formatTime } from '@/lib/utils/formatDate';

type TabType = 'upcoming' | 'past' | 'cancelled';

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [cancelModal, setCancelModal] = useState<{ open: boolean; appointment: Appointment | null }>({
    open: false,
    appointment: null,
  });
  const [cancelReason, setCancelReason] = useState('');

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['myAppointments'],
    queryFn: () => healthcareApi.getMyAppointments({ limit: 50 }),
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      healthcareApi.cancelAppointment(id, reason),
    onSuccess: () => {
      toast.success('Appointment cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
      setCancelModal({ open: false, appointment: null });
      setCancelReason('');
    },
    onError: () => {
      toast.error('Failed to cancel appointment');
    },
  });

  const appointments = data?.data || [];

  const filteredAppointments = appointments.filter((apt: Appointment) => {
    const aptDate = new Date(apt.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === 'cancelled') {
      return apt.status === 'cancelled';
    } else if (activeTab === 'past') {
      return aptDate < today && apt.status !== 'cancelled';
    } else {
      return aptDate >= today && apt.status !== 'cancelled';
    }
  });

  const tabs: { key: TabType; label: string }[] = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
          <p className="text-slate-500 mt-1">Manage your doctor appointments</p>
        </div>
        <Link href="/healthcare/appointments/book">
          <Button leftIcon={<Plus size={18} />}>
            Book Appointment
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={32} />}
          title={`No ${activeTab} appointments`}
          description={activeTab === 'upcoming' ? 'Book an appointment with a doctor' : undefined}
          action={
            activeTab === 'upcoming'
              ? { label: 'Book Now', onClick: () => {} }
              : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment: Appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={() => setCancelModal({ open: true, appointment })}
              showCancelButton={activeTab === 'upcoming'}
            />
          ))}
        </div>
      )}

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModal.open}
        onClose={() => {
          setCancelModal({ open: false, appointment: null });
          setCancelReason('');
        }}
        title="Cancel Appointment"
      >
        <p className="text-slate-600 mb-4">
          Are you sure you want to cancel this appointment with{' '}
          <span className="font-medium">{cancelModal.appointment?.doctor?.name}</span>?
        </p>
        <Textarea
          label="Reason for cancellation"
          placeholder="Please provide a reason..."
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        />
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => {
              setCancelModal({ open: false, appointment: null });
              setCancelReason('');
            }}
          >
            Keep Appointment
          </Button>
          <Button
            variant="danger"
            isLoading={cancelMutation.isPending}
            onClick={() => {
              if (cancelModal.appointment) {
                cancelMutation.mutate({
                  id: cancelModal.appointment.id,
                  reason: cancelReason,
                });
              }
            }}
          >
            Cancel Appointment
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

function AppointmentCard({
  appointment,
  onCancel,
  showCancelButton,
}: {
  appointment: Appointment;
  onCancel: () => void;
  showCancelButton: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Stethoscope className="text-blue-600" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-slate-900">
                  {appointment.doctor?.name || 'Doctor'}
                </h3>
                <StatusBadge status={appointment.status} />
              </div>
              <p className="text-sm text-blue-600">
                {appointment.doctor
                  ? SPECIALIZATION_LABELS[appointment.doctor.specialization] || appointment.doctor.specialization
                  : 'Specialist'}
              </p>

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  <span>{formatDate(appointment.appointmentDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{formatTime(appointment.appointmentTime)}</span>
                </div>
                {appointment.hospital && (
                  <div className="flex items-center gap-2">
                    <Building2 size={16} />
                    <span>{appointment.hospital.name}</span>
                  </div>
                )}
              </div>

              {appointment.symptoms && (
                <p className="text-sm text-slate-500 mt-2">
                  <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                </p>
              )}

              {appointment.cancellationReason && (
                <p className="text-sm text-red-600 mt-2">
                  <span className="font-medium">Cancellation reason:</span> {appointment.cancellationReason}
                </p>
              )}
            </div>
          </div>

          {showCancelButton && appointment.status !== 'cancelled' && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<X size={16} />}
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
