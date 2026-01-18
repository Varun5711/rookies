'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Droplet,
  Zap,
  Trash2,
  Car,
  TreePine,
  Building2,
  Phone,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { urbanApi } from '@/lib/api/urban';
import { Category } from '@/lib/types/urban';

const categoryIcons: Record<string, React.ReactNode> = {
  water: <Droplet className="text-blue-600" size={24} />,
  electricity: <Zap className="text-yellow-600" size={24} />,
  sanitation: <Trash2 className="text-green-600" size={24} />,
  roads: <Car className="text-orange-600" size={24} />,
  parks: <TreePine className="text-emerald-600" size={24} />,
  building: <Building2 className="text-purple-600" size={24} />,
  default: <LayoutDashboard className="text-slate-600" size={24} />,
};

export default function CategoriesPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['grievanceCategories'],
    queryFn: () => urbanApi.getCategories(),
  });

  const getIcon = (category: Category) => {
    const iconKey = category.icon?.toLowerCase() || category.name.toLowerCase().split(' ')[0];
    return categoryIcons[iconKey] || categoryIcons.default;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Grievance Categories</h1>
        <p className="text-slate-500 mt-1">Select a category to file your grievance</p>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(categories || []).map((category: Category) => (
            <CategoryCard key={category.id} category={category} getIcon={getIcon} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryCard({
  category,
  getIcon,
}: {
  category: Category;
  getIcon: (category: Category) => React.ReactNode;
}) {
  return (
    <Card hover>
      <CardContent className="p-6">
        <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-4">
          {getIcon(category)}
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-2">{category.name}</h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{category.description}</p>

        <div className="space-y-2 text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-2">
            <Building2 size={14} />
            <span>{category.department}</span>
          </div>
          {category.departmentPhone && (
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span>{category.departmentPhone}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <span>Resolution time: {category.slaDays} days</span>
          </div>
        </div>

        <Link href={`/urban/grievances/new?categoryId=${category.id}`}>
          <Button className="w-full" rightIcon={<ArrowRight size={16} />}>
            File Grievance
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
