'use client';

import Link from 'next/link';
import { AlertCircle, FolderOpen, Plus, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const features = [
  {
    name: 'Submit Grievance',
    description: 'Report civic issues and track their resolution',
    icon: Plus,
    href: '/urban/grievances/new',
    color: 'red',
  },
  {
    name: 'My Grievances',
    description: 'View and track all your submitted grievances',
    icon: FolderOpen,
    href: '/urban/grievances',
    color: 'blue',
  },
  {
    name: 'Grievance Categories',
    description: 'Browse different types of civic issues you can report',
    icon: AlertCircle,
    href: '/urban/categories',
    color: 'purple',
  },
];

const colorClasses = {
  red: 'bg-red-50 text-red-700',
  blue: 'bg-blue-50 text-blue-700',
  purple: 'bg-purple-50 text-purple-700',
};

export default function UrbanPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          Urban Services
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Report civic issues, track grievances, and help improve your city's
          infrastructure and services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.name} href={feature.href} className="block">
              <Card className="p-8 hover:shadow-xl transition-all h-full">
                <div className="flex flex-col items-center text-center gap-4">
                  <div
                    className={`p-4 rounded-2xl ${
                      colorClasses[feature.color as keyof typeof colorClasses]
                    }`}
                  >
                    <Icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-slate-600 mb-4">{feature.description}</p>
                    <Button variant="outline" size="sm">
                      {feature.name === 'Submit Grievance' ? 'Get Started' : 'View'}
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="p-8 bg-gradient-to-br from-orange-50 to-red-50 border-none">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-orange-700 mb-1">5K+</div>
            <div className="text-slate-600">Grievances Resolved</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-700 mb-1">85%</div>
            <div className="text-slate-600">Resolution Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-700 mb-1">3 days</div>
            <div className="text-slate-600">Avg Resolution Time</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
