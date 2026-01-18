'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, BookOpen, Calendar, MapPin, Sprout } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { agricultureApi } from '@/lib/api/agriculture';
import {
  Advisory,
  SEASON_LABELS,
  ADVISORY_CATEGORY_LABELS,
  Season,
  AdvisoryCategory
} from '@/lib/types/agriculture';
import { formatDate } from '@/lib/utils/formatDate';

export default function AdvisoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [season, setSeason] = useState('');
  const [category, setCategory] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['advisories', page, search, season, category],
    queryFn: () => agricultureApi.getAdvisories({ page, limit: 10, season, category }),
  });

  const advisories = data?.data || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0, limit: 10 };

  const seasonOptions = Object.entries(SEASON_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const categoryOptions = Object.entries(ADVISORY_CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const categoryColors: Record<AdvisoryCategory, string> = {
    pest_control: 'bg-red-50 text-red-700',
    weather: 'bg-blue-50 text-blue-700',
    irrigation: 'bg-cyan-50 text-cyan-700',
    fertilizer: 'bg-green-50 text-green-700',
    harvesting: 'bg-yellow-50 text-yellow-700',
    sowing: 'bg-purple-50 text-purple-700',
    general: 'bg-slate-50 text-slate-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Crop Advisories</h1>
        <p className="text-slate-500 mt-1">Get latest farming advisories for your crops</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search advisories..."
              leftIcon={<Search size={18} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            placeholder="All Seasons"
            options={[{ value: '', label: 'All Seasons' }, ...seasonOptions]}
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          />
          <Select
            placeholder="All Categories"
            options={[{ value: '', label: 'All Categories' }, ...categoryOptions]}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
      </div>

      {/* Advisories List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : advisories.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={32} />}
          title="No advisories found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <>
          <div className="space-y-4">
            {advisories.map((advisory: Advisory) => (
              <AdvisoryCard key={advisory.id} advisory={advisory} categoryColors={categoryColors} />
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

function AdvisoryCard({
  advisory,
  categoryColors
}: {
  advisory: Advisory;
  categoryColors: Record<AdvisoryCategory, string>;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen className="text-green-600" size={24} />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className={categoryColors[advisory.category]}>
                {ADVISORY_CATEGORY_LABELS[advisory.category]}
              </Badge>
              <Badge variant="default">{SEASON_LABELS[advisory.season]}</Badge>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-2">{advisory.title}</h3>

            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-3">
              <div className="flex items-center gap-1">
                <Sprout size={14} />
                <span>{advisory.cropName}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{advisory.state}{advisory.district ? `, ${advisory.district}` : ''}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Valid: {formatDate(advisory.validFrom)} - {formatDate(advisory.validUntil)}</span>
              </div>
            </div>

            <div className={`text-sm text-slate-700 ${expanded ? '' : 'line-clamp-3'}`}>
              {advisory.advisory}
            </div>

            {advisory.advisory.length > 200 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm text-blue-600 hover:underline mt-2"
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}

            {advisory.cropTypes && advisory.cropTypes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {advisory.cropTypes.map((crop) => (
                  <Badge key={crop} variant="default" size="sm">
                    {crop}
                  </Badge>
                ))}
              </div>
            )}

            <p className="text-xs text-slate-400 mt-3">
              Published by: {advisory.publishedBy}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
