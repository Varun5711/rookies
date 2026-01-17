'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ArrowLeft, AlertCircle, MapPin, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { urbanApi } from '@/lib/api/urban';
import { PRIORITY_LABELS, Priority } from '@/lib/types/urban';

const grievanceSchema = z.object({
  categoryId: z.string().min(1, 'Please select a category'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  complainantName: z.string().min(1, 'Name is required'),
  complainantMobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile'),
  complainantEmail: z.string().email('Enter valid email').optional().or(z.literal('')),
  location: z.string().min(1, 'Location is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  ward: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit pincode'),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const),
});

type GrievanceFormData = z.infer<typeof grievanceSchema>;

export default function NewGrievancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCategoryId = searchParams.get('categoryId');

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['grievanceCategories'],
    queryFn: () => urbanApi.getCategories(),
  });

  const form = useForm<GrievanceFormData>({
    resolver: zodResolver(grievanceSchema),
    defaultValues: {
      categoryId: preselectedCategoryId || '',
      title: '',
      description: '',
      complainantName: '',
      complainantMobile: '',
      complainantEmail: '',
      location: '',
      address: '',
      ward: '',
      pincode: '',
      priority: 'medium',
    },
  });

  const submitMutation = useMutation({
    mutationFn: (data: GrievanceFormData) => urbanApi.submitGrievance({
      categoryId: data.categoryId,
      title: data.title,
      description: data.description,
      complainantName: data.complainantName,
      complainantMobile: data.complainantMobile,
      complainantEmail: data.complainantEmail || undefined,
      location: data.location,
      address: data.address,
      ward: data.ward || undefined,
      pincode: data.pincode,
      priority: data.priority as Priority,
    }),
    onSuccess: () => {
      toast.success('Grievance submitted successfully!');
      router.push('/urban/grievances');
    },
    onError: () => {
      toast.error('Failed to submit grievance');
    },
  });

  const onSubmit = (data: GrievanceFormData) => {
    submitMutation.mutate(data);
  };

  const categoryOptions = (categories || []).map((cat: { id: string; name: string }) => ({
    value: cat.id,
    label: cat.name,
  }));

  const priorityOptions = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  if (categoriesLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back Button */}
      <Link href="/urban/grievances" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
        <ArrowLeft size={18} />
        <span>Back to Grievances</span>
      </Link>

      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center">
              <AlertCircle className="text-orange-600" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Submit New Grievance</h1>
              <p className="text-sm text-slate-500">Report a civic issue in your area</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grievance Form */}
      <Card>
        <CardHeader>
          <CardTitle>Grievance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Category & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Category"
                placeholder="Select a category"
                options={categoryOptions}
                error={form.formState.errors.categoryId?.message}
                {...form.register('categoryId')}
              />
              <Select
                label="Priority"
                options={priorityOptions}
                error={form.formState.errors.priority?.message}
                {...form.register('priority')}
              />
            </div>

            {/* Title & Description */}
            <Input
              label="Title"
              placeholder="Brief summary of the issue"
              error={form.formState.errors.title?.message}
              {...form.register('title')}
            />

            <Textarea
              label="Description"
              placeholder="Describe the issue in detail..."
              error={form.formState.errors.description?.message}
              {...form.register('description')}
            />

            {/* Complainant Details */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-medium text-slate-900">Your Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="Enter your name"
                  error={form.formState.errors.complainantName?.message}
                  {...form.register('complainantName')}
                />
                <Input
                  label="Mobile Number"
                  placeholder="10-digit mobile number"
                  error={form.formState.errors.complainantMobile?.message}
                  {...form.register('complainantMobile')}
                />
              </div>
              <Input
                label="Email (optional)"
                placeholder="your@email.com"
                type="email"
                error={form.formState.errors.complainantEmail?.message}
                {...form.register('complainantEmail')}
              />
            </div>

            {/* Location Details */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-medium text-slate-900 flex items-center gap-2">
                <MapPin size={18} className="text-blue-600" />
                Location Details
              </h3>
              <Input
                label="Location / Landmark"
                placeholder="e.g., Near XYZ School"
                error={form.formState.errors.location?.message}
                {...form.register('location')}
              />
              <Textarea
                label="Full Address"
                placeholder="Enter complete address..."
                error={form.formState.errors.address?.message}
                {...form.register('address')}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Ward (optional)"
                  placeholder="Ward number or name"
                  {...form.register('ward')}
                />
                <Input
                  label="Pincode"
                  placeholder="6-digit pincode"
                  maxLength={6}
                  error={form.formState.errors.pincode?.message}
                  {...form.register('pincode')}
                />
              </div>
            </div>

            {/* Attachments */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-medium text-slate-900">Attachments (Optional)</h3>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                <p className="text-sm text-slate-500">
                  Drag & drop images or click to upload
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PNG, JPG up to 5MB each (max 3 files)
                </p>
                <Button variant="outline" size="sm" className="mt-4" type="button">
                  Browse Files
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
              <Link href="/urban/grievances">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" isLoading={submitMutation.isPending}>
                Submit Grievance
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
