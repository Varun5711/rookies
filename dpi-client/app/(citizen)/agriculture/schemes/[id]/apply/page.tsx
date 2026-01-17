'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ArrowLeft, FileText, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { agricultureApi } from '@/lib/api/agriculture';

const applicationSchema = z.object({
  applicantName: z.string().min(1, 'Name is required'),
  applicantMobile: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile'),
  applicantAadhar: z.string().regex(/^\d{12}$/, 'Enter valid 12-digit Aadhaar'),
  landHolding: z.string().min(1, 'Land holding is required'),
  address: z.string().min(1, 'Address is required'),
  bankAccount: z.string().min(1, 'Bank account is required'),
  ifscCode: z.string().min(1, 'IFSC code is required'),
  additionalInfo: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function ApplyForSchemePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: scheme, isLoading } = useQuery({
    queryKey: ['scheme', id],
    queryFn: () => agricultureApi.getScheme(id),
  });

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      applicantName: '',
      applicantMobile: '',
      applicantAadhar: '',
      landHolding: '',
      address: '',
      bankAccount: '',
      ifscCode: '',
      additionalInfo: '',
    },
  });

  const applyMutation = useMutation({
    mutationFn: (data: ApplicationFormData) =>
      agricultureApi.applyForScheme(id, {
        applicantName: data.applicantName,
        applicantMobile: data.applicantMobile,
        applicantAadhar: data.applicantAadhar,
        formData: {
          landHolding: data.landHolding,
          address: data.address,
          bankAccount: data.bankAccount,
          ifscCode: data.ifscCode,
          additionalInfo: data.additionalInfo || '',
        },
        documentUrls: [],
      }),
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      router.push('/agriculture/my-applications');
    },
    onError: () => {
      toast.error('Failed to submit application');
    },
  });

  const onSubmit = (data: ApplicationFormData) => {
    applyMutation.mutate(data);
  };

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

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back Button */}
      <Link href={`/agriculture/schemes/${id}`} className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
        <ArrowLeft size={18} />
        <span>Back to Scheme Details</span>
      </Link>

      {/* Scheme Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
              <FileText className="text-green-600" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Apply for {scheme.name}</h1>
              <p className="text-sm text-slate-500">{scheme.ministryName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Form */}
      <Card>
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="font-medium text-slate-900">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  error={form.formState.errors.applicantName?.message}
                  {...form.register('applicantName')}
                />
                <Input
                  label="Mobile Number"
                  placeholder="10-digit mobile number"
                  error={form.formState.errors.applicantMobile?.message}
                  {...form.register('applicantMobile')}
                />
              </div>
              <Input
                label="Aadhaar Number"
                placeholder="12-digit Aadhaar number"
                maxLength={12}
                error={form.formState.errors.applicantAadhar?.message}
                {...form.register('applicantAadhar')}
              />
              <Textarea
                label="Address"
                placeholder="Enter your full address"
                error={form.formState.errors.address?.message}
                {...form.register('address')}
              />
            </div>

            {/* Land Details */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-medium text-slate-900">Land Details</h3>
              <Input
                label="Land Holding (in acres)"
                placeholder="e.g., 2.5"
                error={form.formState.errors.landHolding?.message}
                {...form.register('landHolding')}
              />
            </div>

            {/* Bank Details */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-medium text-slate-900">Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Bank Account Number"
                  placeholder="Enter account number"
                  error={form.formState.errors.bankAccount?.message}
                  {...form.register('bankAccount')}
                />
                <Input
                  label="IFSC Code"
                  placeholder="e.g., SBIN0001234"
                  error={form.formState.errors.ifscCode?.message}
                  {...form.register('ifscCode')}
                />
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-medium text-slate-900">Required Documents</h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <ul className="space-y-2 text-sm text-slate-600">
                  {scheme.requiredDocuments.map((doc, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Upload size={14} className="text-slate-400" />
                      {doc}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-500 mt-3">
                  Note: Document upload feature coming soon. Please keep documents ready.
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <Textarea
                label="Additional Information (optional)"
                placeholder="Any other details you want to share..."
                {...form.register('additionalInfo')}
              />
            </div>

            {/* Declaration */}
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                By submitting this application, I declare that all information provided is true and correct to the best of my knowledge.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link href={`/agriculture/schemes/${id}`}>
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" isLoading={applyMutation.isPending}>
                Submit Application
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
