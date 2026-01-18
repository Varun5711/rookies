"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { urbanApi } from '@/lib/api';
import { Category } from '@/lib/types/urban';
import { ArrowRight, Search, FileText, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Skeleton Loader
const SkeletonCard = () => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-100 animate-pulse">
    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
  </div>
);

const UrbanPage: React.FC = () => {
  const router = useRouter();

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: () => urbanApi.getCategories(),
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Urban Services</h1>
        <p className="text-slate-500 mt-1">Report grievances, and access other urban services.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="w-full md:w-2/3">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 mb-8">
              <div className="flex items-center gap-3 mb-4">
                  <FileText className="text-slate-400" size={20} />
                  <h2 className="text-xl font-semibold text-slate-700">Lodge a Grievance</h2>
              </div>
              <p className="text-slate-500 mb-4">Select a category to submit your grievance. Your issue will be directed to the concerned department for resolution.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isLoadingCategories ? (
                  Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                ) : (
                  categories?.map(category => (
                    <div 
                      key={category.id} 
                      className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 cursor-pointer transition-colors"
                      onClick={() => router.push(`/citizen/urban/grievances/new?category=${category.id}`)}
                    >
                      <h3 className="font-semibold text-slate-700">{category.name}</h3>
                    </div>
                  ))
                )}
              </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                <h2 className="text-xl font-semibold text-slate-700 mb-4">My Grievances</h2>
                <p className="text-slate-500 text-sm mb-4">Track the status of your submitted grievances.</p>
                <button 
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  onClick={() => router.push('/citizen/urban/grievances')}
                >
                    View My Grievances
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UrbanPage;
