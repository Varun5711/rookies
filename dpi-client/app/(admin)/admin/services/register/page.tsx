'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ArrowLeft, Server } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AdminGuard } from '@/components/guards/AdminGuard';
import apiClient from '@/lib/api/client';

const registerServiceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  description: z.string().min(1, 'Description is required'),
  baseUrl: z.string().url('Must be a valid URL'),
  healthEndpoint: z.string().default('/api/health'),
  version: z.string().default('1.0.0'),
  owner: z.string().min(1, 'Owner is required'),
  tags: z.string().default(''),
  isPublic: z.boolean().default(false),
  requiredRoles: z.string().default(''),
});

type RegisterServiceFormData = z.infer<typeof registerServiceSchema>;

// Predefined services for quick registration
const PREDEFINED_SERVICES = [
  {
    name: 'analytics',
    displayName: 'Analytics Service',
    description: 'Dashboard analytics and statistics',
    baseUrl: 'http://localhost:3050',
    healthEndpoint: '/api/health',
    version: '1.0.0',
    owner: 'platform-admin',
    tags: 'analytics,dashboard',
    isPublic: false,
    requiredRoles: 'PLATFORM_ADMIN',
  },
  {
    name: 'healthcare',
    displayName: 'Healthcare Service',
    description: 'Hospital and appointment management',
    baseUrl: 'http://localhost:3010',
    healthEndpoint: '/api/health',
    version: '1.0.0',
    owner: 'health-ministry',
    tags: 'healthcare,hospitals',
    isPublic: false,
    requiredRoles: 'CITIZEN',
  },
  {
    name: 'agriculture',
    displayName: 'Agriculture Service',
    description: 'Schemes, advisories, and market prices',
    baseUrl: 'http://localhost:3020',
    healthEndpoint: '/api/health',
    version: '1.0.0',
    owner: 'agriculture-ministry',
    tags: 'agriculture,schemes',
    isPublic: false,
    requiredRoles: 'CITIZEN',
  },
  {
    name: 'urban',
    displayName: 'Urban Service',
    description: 'Civic grievances and urban services',
    baseUrl: 'http://localhost:3030',
    healthEndpoint: '/api/health',
    version: '1.0.0',
    owner: 'urban-ministry',
    tags: 'urban,grievances',
    isPublic: false,
    requiredRoles: 'CITIZEN',
  },
  {
    name: 'audit',
    displayName: 'Audit Service',
    description: 'Audit logs and activity tracking',
    baseUrl: 'http://localhost:3040',
    healthEndpoint: '/api/health',
    version: '1.0.0',
    owner: 'platform-admin',
    tags: 'audit,logs',
    isPublic: false,
    requiredRoles: 'PLATFORM_ADMIN',
  },
  {
    name: 'service-registry',
    displayName: 'Service Registry',
    description: 'Service discovery and health monitoring',
    baseUrl: 'http://localhost:3002',
    healthEndpoint: '/api/health',
    version: '1.0.0',
    owner: 'platform-admin',
    tags: 'registry,discovery',
    isPublic: true,
    requiredRoles: '',
  },
];

function RegisterServiceContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const form = useForm<RegisterServiceFormData>({
    resolver: zodResolver(registerServiceSchema),
    defaultValues: {
      name: '',
      displayName: '',
      description: '',
      baseUrl: '',
      healthEndpoint: '/api/health',
      version: '1.0.0',
      owner: '',
      tags: '',
      isPublic: false,
      requiredRoles: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterServiceFormData) => {
      const payload = {
        name: data.name,
        displayName: data.displayName,
        description: data.description,
        baseUrl: data.baseUrl,
        healthEndpoint: data.healthEndpoint,
        version: data.version,
        owner: data.owner,
        tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
        isPublic: data.isPublic,
        requiredRoles: data.requiredRoles
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean),
      };

      const response = await apiClient.post('/registry/services', payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Service registered successfully');
      queryClient.invalidateQueries({ queryKey: ['adminServices'] });
      router.push('/admin/services');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to register service');
    },
  });

  const handlePresetSelect = (presetName: string) => {
    const preset = PREDEFINED_SERVICES.find((s) => s.name === presetName);
    if (preset) {
      setSelectedPreset(presetName);
      form.reset(preset);
    }
  };

  const onSubmit = (data: RegisterServiceFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => router.push('/admin/services')}
        >
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Register Service</h1>
          <p className="text-slate-500 mt-1">Add a new service to the registry</p>
        </div>
      </div>

      {/* Quick Register Presets */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Register</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-4">
            Register common services with predefined configurations
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PREDEFINED_SERVICES.map((service) => (
              <button
                key={service.name}
                onClick={() => handlePresetSelect(service.name)}
                className={`p-4 border-2 rounded-lg text-left hover:border-blue-500 transition-colors ${
                  selectedPreset === service.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Server size={16} className="text-blue-600" />
                  <span className="font-medium text-slate-900">{service.displayName}</span>
                </div>
                <p className="text-xs text-slate-500">{service.name}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Registration Form */}
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Service Name *"
                placeholder="analytics"
                error={form.formState.errors.name?.message}
                {...form.register('name')}
              />
              <Input
                label="Display Name *"
                placeholder="Analytics Service"
                error={form.formState.errors.displayName?.message}
                {...form.register('displayName')}
              />
            </div>

            <Input
              label="Description *"
              placeholder="Dashboard analytics and statistics"
              error={form.formState.errors.description?.message}
              {...form.register('description')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Base URL *"
                placeholder="http://localhost:3050"
                error={form.formState.errors.baseUrl?.message}
                {...form.register('baseUrl')}
              />
              <Input
                label="Health Endpoint"
                placeholder="/api/health"
                error={form.formState.errors.healthEndpoint?.message}
                {...form.register('healthEndpoint')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Version"
                placeholder="1.0.0"
                error={form.formState.errors.version?.message}
                {...form.register('version')}
              />
              <Input
                label="Owner *"
                placeholder="platform-admin"
                error={form.formState.errors.owner?.message}
                {...form.register('owner')}
              />
            </div>

            <Input
              label="Tags (comma-separated)"
              placeholder="analytics, dashboard"
              error={form.formState.errors.tags?.message}
              {...form.register('tags')}
            />

            <Input
              label="Required Roles (comma-separated)"
              placeholder="PLATFORM_ADMIN, CITIZEN"
              error={form.formState.errors.requiredRoles?.message}
              {...form.register('requiredRoles')}
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                {...form.register('isPublic')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isPublic" className="text-sm text-slate-700">
                Public service (no authentication required)
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                loading={registerMutation.isPending}
                leftIcon={<Server size={18} />}
              >
                Register Service
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/services')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterServicePage() {
  return (
    <AdminGuard>
      <RegisterServiceContent />
    </AdminGuard>
  );
}
