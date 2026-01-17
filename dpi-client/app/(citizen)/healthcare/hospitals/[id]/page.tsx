'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Bed,
  ArrowLeft,
  Stethoscope,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { healthcareApi } from '@/lib/api/healthcare';
import { SPECIALIZATION_LABELS } from '@/lib/types/healthcare';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export default function HospitalDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: hospital, isLoading } = useQuery({
    queryKey: ['hospital', id],
    queryFn: () => healthcareApi.getHospital(id),
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!hospital) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-900">Hospital not found</h2>
        <Link href="/healthcare" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to hospitals
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/healthcare" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
        <ArrowLeft size={18} />
        <span>Back to Hospitals</span>
      </Link>

      {/* Hospital Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Building2 className="text-blue-600" size={40} />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{hospital.name}</h1>
                  <p className="text-slate-500 mt-1">{hospital.address}</p>
                </div>
                <Badge variant={hospital.type === 'government' ? 'info' : 'secondary'} size="md">
                  {hospital.type === 'government' ? 'Government' : 'Private'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                    <MapPin className="text-slate-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="text-sm font-medium text-slate-900">{hospital.city}, {hospital.state}</p>
                  </div>
                </div>

                {hospital.contactNumber && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                      <Phone className="text-slate-600" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="text-sm font-medium text-slate-900">{hospital.contactNumber}</p>
                    </div>
                  </div>
                )}

                {hospital.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                      <Mail className="text-slate-600" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="text-sm font-medium text-slate-900">{hospital.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bed Availability & Facilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed size={20} className="text-blue-600" />
              Bed Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(hospital.availableBeds / hospital.totalBeds) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900">{hospital.availableBeds}</p>
                <p className="text-sm text-slate-500">of {hospital.totalBeds} available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {hospital.facilities?.map((facility) => (
                <Badge key={facility} variant="default" size="md">
                  {facility}
                </Badge>
              ))}
              {(!hospital.facilities || hospital.facilities.length === 0) && (
                <p className="text-sm text-slate-500">No facilities listed</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctors */}
      {hospital.doctors && hospital.doctors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope size={20} className="text-blue-600" />
              Doctors at this Hospital
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {hospital.doctors.map((doctor) => (
                <div key={doctor.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                      <Stethoscope className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{doctor.name}</h4>
                      <p className="text-sm text-slate-500">
                        {SPECIALIZATION_LABELS[doctor.specialization] || doctor.specialization}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">{formatCurrency(doctor.consultationFee)}</p>
                    <Link href={`/healthcare/doctors/${doctor.id}`}>
                      <Button variant="ghost" size="sm">View Profile</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      <div className="flex justify-center">
        <Link href="/healthcare/appointments/book">
          <Button size="lg">Book an Appointment</Button>
        </Link>
      </div>
    </div>
  );
}
