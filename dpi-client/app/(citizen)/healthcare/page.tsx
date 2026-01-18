'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Phone, Bed, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { healthcareApi } from '@/lib/api/healthcare';
import { Hospital } from '@/lib/types/healthcare';
import { INDIAN_STATES } from '@/lib/constants';

export default function HospitalsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [state, setState] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['hospitals', page, search, type, state],
    queryFn: () => healthcareApi.getHospitals({ page, limit: 9, search, type, state }),
  });

  const hospitals = data?.data || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0, limit: 9 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospitals</h1>
          <p className="text-slate-500 mt-1">Find and explore hospitals near you</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by hospital name, city..."
              leftIcon={<Search size={18} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            placeholder="All Types"
            options={[
              { value: '', label: 'All Types' },
              { value: 'government', label: 'Government' },
              { value: 'private', label: 'Private' },
            ]}
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <Select
            placeholder="All States"
            options={[
              { value: '', label: 'All States' },
              ...INDIAN_STATES.map((state) => ({ value: state, label: state })),
            ]}
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>
      </div>

      {/* Hospital Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : hospitals.length === 0 ? (
        <EmptyState
          icon={<Building2 size={32} />}
          title="No hospitals found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital: Hospital) => (
              <HospitalCard key={hospital.id} hospital={hospital} />
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

function HospitalCard({ hospital }: { hospital: Hospital }) {
  return (
    <Card hover>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Building2 className="text-blue-600" size={24} />
          </div>
          <Badge variant={hospital.type === 'government' ? 'info' : 'secondary'}>
            {hospital.type === 'government' ? 'Government' : 'Private'}
          </Badge>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-2">{hospital.name}</h3>

        <div className="space-y-2 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{hospital.city}, {hospital.state}</span>
          </div>
          {hospital.contactNumber && (
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span>{hospital.contactNumber}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Bed size={16} />
            <span>{hospital.availableBeds} / {hospital.totalBeds} beds available</span>
          </div>
        </div>

        {hospital.facilities && hospital.facilities.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {hospital.facilities.slice(0, 3).map((facility) => (
              <Badge key={facility} variant="default" size="sm">
                {facility}
              </Badge>
            ))}
            {hospital.facilities.length > 3 && (
              <Badge variant="default" size="sm">
                +{hospital.facilities.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-100">
          <Link href={`/healthcare/hospitals/${hospital.id}`}>
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
