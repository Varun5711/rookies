'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Search, Stethoscope, Building2, Clock, IndianRupee } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { healthcareApi } from '@/lib/api/healthcare';
import { Doctor, SPECIALIZATION_LABELS, Specialization } from '@/lib/types/healthcare';
import { formatCurrency } from '@/lib/utils/formatCurrency';

export default function DoctorsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['doctors', page, search, specialization],
    queryFn: () => healthcareApi.getDoctors({ page, limit: 9, search, specialization }),
  });

  const doctors = data?.data || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0, limit: 9 };

  const specializationOptions = Object.entries(SPECIALIZATION_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Doctors</h1>
          <p className="text-slate-500 mt-1">Find and book appointments with doctors</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by doctor name..."
              leftIcon={<Search size={18} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            placeholder="All Specializations"
            options={[{ value: '', label: 'All Specializations' }, ...specializationOptions]}
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
        </div>
      </div>

      {/* Doctor Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <EmptyState
          icon={<Stethoscope size={32} />}
          title="No doctors found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor: Doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
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

function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Card hover>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
            <Stethoscope className="text-blue-600" size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">{doctor.name}</h3>
            <p className="text-sm text-blue-600 font-medium">
              {SPECIALIZATION_LABELS[doctor.specialization] || doctor.specialization}
            </p>
            <Badge
              variant={doctor.isAvailable ? 'success' : 'default'}
              size="sm"
              className="mt-2"
            >
              {doctor.isAvailable ? 'Available' : 'Not Available'}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{doctor.experienceYears} years experience</span>
          </div>
          {doctor.hospital && (
            <div className="flex items-center gap-2">
              <Building2 size={16} />
              <span>{doctor.hospital.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <IndianRupee size={16} />
            <span>{formatCurrency(doctor.consultationFee)} per consultation</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
          <Link href={`/healthcare/doctors/${doctor.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Profile
            </Button>
          </Link>
          <Link href={`/healthcare/appointments/book?doctorId=${doctor.id}`} className="flex-1">
            <Button size="sm" className="w-full">
              Book Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
