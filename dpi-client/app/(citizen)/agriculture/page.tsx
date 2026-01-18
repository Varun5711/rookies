'use client';

import Link from 'next/link';
import { FileText, TrendingUp, MessageSquare, Sprout } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const features = [
  {
    name: 'Government Schemes',
    description: 'Explore and apply for agricultural schemes and subsidies',
    icon: FileText,
    href: '/agriculture/schemes',
    color: 'green',
  },
  {
    name: 'Market Prices',
    description: 'Check real-time commodity prices across different mandis',
    icon: TrendingUp,
    href: '/agriculture/market-prices',
    color: 'blue',
  },
  {
    name: 'Crop Advisories',
    description: 'Get expert advice on crops, seasons, and farming practices',
    icon: MessageSquare,
    href: '/agriculture/advisories',
    color: 'purple',
  },
  {
    name: 'My Applications',
    description: 'Track your scheme applications and their status',
    icon: Sprout,
    href: '/agriculture/my-applications',
    color: 'orange',
  },
];

const colorClasses = {
  green: 'bg-green-50 text-green-700',
  blue: 'bg-blue-50 text-blue-700',
  purple: 'bg-purple-50 text-purple-700',
  orange: 'bg-orange-50 text-orange-700',
};

export default function AgriculturePage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          Agriculture Services
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Access government schemes, market prices, expert advisories, and
          everything you need for modern farming
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.name} href={feature.href} className="block">
              <Card className="p-8 hover:shadow-xl transition-all h-full">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-4 rounded-2xl ${
                      colorClasses[feature.color as keyof typeof colorClasses]
                    }`}
                  >
                    <Icon size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-slate-600 mb-4">{feature.description}</p>
                    <Button variant="outline" size="sm">
                      Explore →
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-none">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-green-700 mb-1">150+</div>
            <div className="text-slate-600">Active Schemes</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-700 mb-1">500+</div>
            <div className="text-slate-600">Mandis Tracked</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-700 mb-1">1000+</div>
            <div className="text-slate-600">Farmers Registered</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
