'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Stethoscope,
  Building2,
  Clock,
  GraduationCap,
  Phone,
  Mail,
  ArrowLeft,
  IndianRupee,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { healthcareApi } from '@/lib/api/healthcare';
import { SPECIALIZATION_LABELS, DayOfWeek } from '@/lib/types/healthcare';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatTime } from '@/lib/utils/formatDate';

const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export default function DoctorDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor', id],
    queryFn: () => healthcareApi.getDoctor(id),
  });

  const { data: slots } = useQuery({
    queryKey: ['doctorSlots', id],
    queryFn: () => healthcareApi.getDoctorSlots(id),
    enabled: !!id,
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-900">Doctor not found</h2>
        <Link href="/healthcare/doctors" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to doctors
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/healthcare/doctors" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
        <ArrowLeft size={18} />
        <span>Back to Doctors</span>
      </Link>

      {/* Doctor Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
              <Stethoscope className="text-blue-600" size={48} />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{doctor.name}</h1>
                  <p className="text-lg text-blue-600 font-medium mt-1">
                    {SPECIALIZATION_LABELS[doctor.specialization] || doctor.specialization}
                  </p>
                </div>
                <Badge
                  variant={doctor.isAvailable ? 'success' : 'default'}
                  size="md"
                >
                  {doctor.isAvailable ? 'Available' : 'Not Available'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                    <Clock className="text-slate-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Experience</p>
                    <p className="text-sm font-medium text-slate-900">{doctor.experienceYears} years</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                    <GraduationCap className="text-slate-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Qualification</p>
                    <p className="text-sm font-medium text-slate-900">{doctor.qualification}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                    <IndianRupee className="text-slate-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Consultation Fee</p>
                    <p className="text-sm font-medium text-slate-900">{formatCurrency(doctor.consultationFee)}</p>
                  </div>
                </div>
              </div>

              {doctor.hospital && (
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building2 className="text-slate-600" size={20} />
                    <div>
                      <p className="font-medium text-slate-900">{doctor.hospital.name}</p>
                      <p className="text-sm text-slate-500">
                        {doctor.hospital.city}, {doctor.hospital.state}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Registration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {doctor.contactNumber && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                  <Phone className="text-slate-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-sm font-medium text-slate-900">{doctor.contactNumber}</p>
                </div>
              </div>
            )}
            {doctor.email && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                  <Mail className="text-slate-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-900">{doctor.email}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <p className="text-xs text-slate-500">Registration No:</p>
              <p className="text-sm font-medium text-slate-900">{doctor.registrationNumber}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              Available Time Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            {slots && slots.length > 0 ? (
              <div className="space-y-3">
                {slots.filter(s => s.isAvailable).map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-900">{DAY_LABELS[slot.dayOfWeek]}</span>
                    <span className="text-slate-600">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">
                No time slots available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Book Appointment Button */}
      <div className="flex justify-center">
        <Link href={`/healthcare/appointments/book?doctorId=${doctor.id}`}>
          <Button size="lg" disabled={!doctor.isAvailable}>
            Book Appointment
          </Button>
        </Link>
      </div>
    </div>
  );
}
