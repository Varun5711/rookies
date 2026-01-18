'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { agricultureApi } from '@/lib/api';
import { Scheme, Advisory } from '@/lib/types/agriculture';
import { ArrowRight, Search, BookOpen, HandHelping } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Skeleton Loader
const SkeletonCard = () => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 animate-pulse">
    <div className="h-24 bg-slate-200 rounded-md mb-4"></div>
    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
  </div>
);

const AgriculturePage: React.FC = () => {
  const router = useRouter();

  const { data: schemesData, isLoading: isLoadingSchemes } = useQuery({
    queryKey: ['schemes'],
    queryFn: () => agricultureApi.getSchemes({ limit: 3 }),
  });

  const { data: advisoriesData, isLoading: isLoadingAdvisories } = useQuery({
    queryKey: ['advisories'],
    queryFn: () => agricultureApi.getAdvisories({ limit: 3 }),
  });

  const schemes = schemesData?.data || [];
  const advisories = advisoriesData?.data || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Agriculture Services
        </h1>
        <p className="text-slate-500 mt-1">
          Empowering farmers with information and access to government schemes.
        </p>
      </div>

      {/* Featured Schemes */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <HandHelping className="text-green-500" /> Government Schemes
          </h2>
          <a
            href="/citizen/agriculture/schemes"
            className="flex items-center text-sm font-medium text-blue-600 hover:underline"
          >
            View All <ArrowRight size={16} className="ml-1" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingSchemes
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : schemes?.map((scheme) => (
                <div
                  key={scheme.id}
                  className="bg-white rounded-lg p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() =>
                    router.push(`/citizen/agriculture/schemes/${scheme.id}`)
                  }
                >
                  <h3 className="font-bold text-lg text-slate-800 truncate mb-2">
                    {scheme.name}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {scheme.description}
                  </p>
                  <div className="mt-4 text-xs">
                    <span className="font-semibold text-slate-600">
                      {scheme.ministryName}
                    </span>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* Latest Advisories */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <BookOpen className="text-orange-500" /> Latest Advisories
          </h2>
          <a
            href="/citizen/agriculture/advisories"
            className="flex items-center text-sm font-medium text-blue-600 hover:underline"
          >
            View All <ArrowRight size={16} className="ml-1" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingAdvisories
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : advisories?.map((advisory) => (
                <div
                  key={advisory.id}
                  className="bg-white rounded-lg p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <h3 className="font-bold text-lg text-slate-800 mb-2">
                    {advisory.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {advisory.advisory}
                  </p>
                  <div className="text-xs mt-4">
                    <span className="text-slate-600 font-medium">
                      {new Date(advisory.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
        </div>
      </section>
    </div>
  );
};

export default AgriculturePage;
