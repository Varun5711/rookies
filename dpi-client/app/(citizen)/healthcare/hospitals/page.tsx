'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { healthcareApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search, MapPin, Building2, Bed, Phone } from 'lucide-react';
import Link from 'next/link';
import { INDIAN_STATES } from '@/lib/constants';
import { HOSPITAL_TYPE_OPTIONS } from '@/lib/constants/healthcare';

export default function HospitalsPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    type: '',
    page: 1,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['hospitals', filters, search],
    queryFn: () =>
      healthcareApi.getHospitals({
        ...filters,
        search: search || undefined,
        limit: 12,
      }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Hospitals</h1>
        <p className="text-slate-600 mt-1">
          Find hospitals and healthcare facilities near you
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search hospitals..."
            leftIcon={<Search size={18} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={filters.state}
            onChange={(e) =>
              setFilters({ ...filters, state: e.target.value, page: 1 })
            }
          >
            <option value="">All States</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </Select>
          <Input
            placeholder="City"
            value={filters.city}
            onChange={(e) =>
              setFilters({ ...filters, city: e.target.value, page: 1 })
            }
          />
          <Select
            value={filters.type}
            onChange={(e) =>
              setFilters({ ...filters, type: e.target.value, page: 1 })
            }
            options={HOSPITAL_TYPE_OPTIONS}
          />
        </div>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : !data?.data || data.data.length === 0 ? (
        <EmptyState
          icon={<Building2 size={48} />}
          title="No hospitals found"
          description="Try adjusting your filters"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.map((hospital: any) => (
            <Link
              key={hospital.id}
              href={`/healthcare/hospitals/${hospital.id}`}
              className="block"
            >
              <Card className="p-6 hover:shadow-lg transition-all h-full">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-slate-900 text-lg">
                    {hospital.name}
                  </h3>
                  <Badge
                    variant={
                      hospital.type === 'government' ? 'primary' : 'secondary'
                    }
                  >
                    {hospital.type}
                  </Badge>
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {hospital.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={16} className="flex-shrink-0" />
                    <span className="truncate">
                      {hospital.city}, {hospital.state}
                    </span>
                  </div>

                  {hospital.totalBeds && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Bed size={16} className="flex-shrink-0" />
                      <span>
                        {hospital.availableBeds}/{hospital.totalBeds} beds
                        available
                      </span>
                    </div>
                  )}

                  {hospital.contactNumber && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone size={16} className="flex-shrink-0" />
                      <span>{hospital.contactNumber}</span>
                    </div>
                  )}
                </div>

                {hospital.facilities && hospital.facilities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-4">
                    {hospital.facilities.slice(0, 3).map((facility: string) => (
                      <span
                        key={facility}
                        className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                      >
                        {facility}
                      </span>
                    ))}
                    {hospital.facilities.length > 3 && (
                      <span className="px-2 py-1 text-xs text-slate-500">
                        +{hospital.facilities.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
