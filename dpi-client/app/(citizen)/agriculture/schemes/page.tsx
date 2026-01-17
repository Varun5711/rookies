'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Search, FileText, IndianRupee, Calendar, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { agricultureApi } from '@/lib/api/agriculture';
import { Scheme, SCHEME_CATEGORY_LABELS, SchemeCategory } from '@/lib/types/agriculture';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';

export default function SchemesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['schemes', page, search, category],
    queryFn: () => agricultureApi.getSchemes({ page, limit: 9, category }),
  });

  const schemes = data?.data || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0, limit: 9 };

  const categoryOptions = Object.entries(SCHEME_CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Agriculture Schemes</h1>
        <p className="text-slate-500 mt-1">Explore and apply for government schemes</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search schemes..."
              leftIcon={<Search size={18} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            placeholder="All Categories"
            options={[{ value: '', label: 'All Categories' }, ...categoryOptions]}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
      </div>

      {/* Schemes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : schemes.length === 0 ? (
        <EmptyState
          icon={<FileText size={32} />}
          title="No schemes found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme: Scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
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

function SchemeCard({ scheme }: { scheme: Scheme }) {
  const categoryColors: Record<SchemeCategory, string> = {
    subsidy: 'bg-green-50 text-green-700',
    loan: 'bg-blue-50 text-blue-700',
    insurance: 'bg-purple-50 text-purple-700',
    training: 'bg-orange-50 text-orange-700',
    equipment: 'bg-cyan-50 text-cyan-700',
    other: 'bg-slate-50 text-slate-700',
  };

  return (
    <Card hover>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <FileText className="text-green-600" size={24} />
          </div>
          <Badge className={categoryColors[scheme.category]}>
            {SCHEME_CATEGORY_LABELS[scheme.category]}
          </Badge>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">{scheme.name}</h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{scheme.description}</p>

        <div className="space-y-2 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <IndianRupee size={16} />
            <span>Benefit: {formatCurrency(scheme.benefitAmount)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building size={16} />
            <span>{scheme.ministryName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Ends: {scheme.endDate ? formatDate(scheme.endDate) : 'Ongoing'}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
          <Link href={`/agriculture/schemes/${scheme.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          <Link href={`/agriculture/schemes/${scheme.id}/apply`} className="flex-1">
            <Button size="sm" className="w-full">
              Apply Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
