'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  IndianRupee,
  Calendar,
  Building,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { agricultureApi } from '@/lib/api/agriculture';
import { SCHEME_CATEGORY_LABELS } from '@/lib/types/agriculture';
import { formatCurrency, formatNumber } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';

export default function SchemeDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: scheme, isLoading } = useQuery({
    queryKey: ['scheme', id],
    queryFn: () => agricultureApi.getScheme(id),
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!scheme) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-slate-900">Scheme not found</h2>
        <Link href="/agriculture/schemes" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to schemes
        </Link>
      </div>
    );
  }

  const budgetPercentage = (scheme.utilizedBudget / scheme.totalBudget) * 100;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/agriculture/schemes" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
        <ArrowLeft size={18} />
        <span>Back to Schemes</span>
      </Link>

      {/* Scheme Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <FileText className="text-green-600" size={40} />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <Badge className="mb-2">{SCHEME_CATEGORY_LABELS[scheme.category]}</Badge>
                  <h1 className="text-2xl font-bold text-slate-900">{scheme.name}</h1>
                  <p className="text-slate-500 mt-2">{scheme.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                    <IndianRupee className="text-slate-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Benefit Amount</p>
                    <p className="text-sm font-medium text-slate-900">{formatCurrency(scheme.benefitAmount)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                    <Building className="text-slate-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Ministry</p>
                    <p className="text-sm font-medium text-slate-900">{scheme.ministryName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                    <Calendar className="text-slate-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Valid Until</p>
                    <p className="text-sm font-medium text-slate-900">
                      {scheme.endDate ? formatDate(scheme.endDate) : 'Ongoing'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Info */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">
                {formatCurrency(scheme.utilizedBudget)} / {formatCurrency(scheme.totalBudget)}
              </p>
              <p className="text-xs text-slate-500">{budgetPercentage.toFixed(1)}% utilized</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eligibility & Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-green-600" />
              Eligibility Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {Object.entries(scheme.eligibilityCriteria).map(([key, value]) => (
                <li key={key} className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">
                    <span className="font-medium">{key}:</span> {value}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck size={20} className="text-blue-600" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {scheme.requiredDocuments.map((doc, index) => (
                <li key={index} className="flex items-start gap-2">
                  <FileText size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{doc}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {scheme.officialLink && (
          <a href={scheme.officialLink} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" leftIcon={<ExternalLink size={18} />}>
              Official Website
            </Button>
          </a>
        )}
        <Link href={`/agriculture/schemes/${scheme.id}/apply`}>
          <Button size="lg">Apply for this Scheme</Button>
        </Link>
      </div>
    </div>
  );
}
