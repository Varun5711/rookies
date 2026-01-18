'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { agricultureApi } from '@/lib/api/agriculture';
import { MarketPrice } from '@/lib/types/agriculture';
import { formatCurrency, formatNumber } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';
import { INDIAN_STATES } from '@/lib/constants';

export default function MarketPricesPage() {
  const [page, setPage] = useState(1);
  const [commodity, setCommodity] = useState('');
  const [state, setState] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['marketPrices', page, commodity, state],
    queryFn: () => agricultureApi.getMarketPrices({ page, limit: 15, commodity, state }),
  });

  const { data: commodities } = useQuery({
    queryKey: ['commodities'],
    queryFn: () => agricultureApi.getCommodities(),
  });

  const prices = data?.data || [];
  const meta = data?.meta || { page: 1, totalPages: 1, total: 0, limit: 15 };

  const commodityOptions = (commodities || []).map((c: string) => ({
    value: c,
    label: c,
  }));

  const stateOptions = [
    { value: '', label: 'All States' },
    ...INDIAN_STATES.map((state) => ({ value: state, label: state })),
  ];

  const columns = [
    {
      key: 'commodity',
      header: 'Commodity',
      render: (item: MarketPrice) => (
        <div className="font-medium text-slate-900">{item.commodity}</div>
      ),
    },
    {
      key: 'mandi',
      header: 'Mandi / Market',
      render: (item: MarketPrice) => (
        <div>
          <div className="text-slate-900">{item.mandi}</div>
          <div className="text-xs text-slate-500">{item.district}, {item.state}</div>
        </div>
      ),
    },
    {
      key: 'minPrice',
      header: 'Min Price',
      render: (item: MarketPrice) => (
        <span className="text-slate-600">{formatCurrency(item.minPrice)}/{item.unit}</span>
      ),
    },
    {
      key: 'maxPrice',
      header: 'Max Price',
      render: (item: MarketPrice) => (
        <span className="text-slate-600">{formatCurrency(item.maxPrice)}/{item.unit}</span>
      ),
    },
    {
      key: 'modalPrice',
      header: 'Modal Price',
      render: (item: MarketPrice) => (
        <span className="font-semibold text-green-600">{formatCurrency(item.modalPrice)}/{item.unit}</span>
      ),
    },
    {
      key: 'arrivals',
      header: 'Arrivals',
      render: (item: MarketPrice) => (
        <span className="text-slate-600">{formatNumber(item.arrivalsTonnes)} tonnes</span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (item: MarketPrice) => (
        <span className="text-slate-500 text-sm">{formatDate(item.priceDate)}</span>
      ),
    },
  ];

  // Calculate summary stats
  const summary = prices.length > 0 ? {
    avgModalPrice: prices.reduce((acc: number, p: MarketPrice) => acc + p.modalPrice, 0) / prices.length,
    totalArrivals: prices.reduce((acc: number, p: MarketPrice) => acc + p.arrivalsTonnes, 0),
    uniqueCommodities: new Set(prices.map((p: MarketPrice) => p.commodity)).size,
  } : null;

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Market Prices</h1>
        <p className="text-slate-500 mt-1">Latest commodity prices from mandis across India</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(summary.avgModalPrice)}</p>
                <p className="text-sm text-slate-500">Avg. Modal Price</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{formatNumber(summary.totalArrivals)}</p>
                <p className="text-sm text-slate-500">Total Arrivals (tonnes)</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <Minus className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{summary.uniqueCommodities}</p>
                <p className="text-sm text-slate-500">Commodities Listed</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search commodity..."
            leftIcon={<Search size={18} />}
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
          />
          <Select
            placeholder="All Commodities"
            options={[{ value: '', label: 'All Commodities' }, ...commodityOptions]}
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
          />
          <Select
            placeholder="All States"
            options={[{ value: '', label: 'All States' }, ...stateOptions]}
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>
      </div>

      {/* Prices Table */}
      {prices.length === 0 ? (
        <EmptyState
          icon={<TrendingUp size={32} />}
          title="No market prices found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={prices}
            keyExtractor={(item) => item.id}
          />

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
