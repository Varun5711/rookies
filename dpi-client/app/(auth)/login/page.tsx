'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Shield, Phone, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { UserRole } from '@/lib/types/auth';

const mobileSchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

type MobileFormData = z.infer<typeof mobileSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const mobileForm = useForm<MobileFormData>({
    resolver: zodResolver(mobileSchema),
    defaultValues: { mobile: '' },
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const handleSendOtp = async (data: MobileFormData) => {
    setIsLoading(true);
    try {
      await authApi.sendOtp(data.mobile);
      setMobile(data.mobile);
      setStep('otp');
      toast.success('OTP sent successfully!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (data: OTPFormData) => {
    setIsLoading(true);
    try {
      const response = await authApi.verifyOtp(mobile, data.otp);
      
      // Ensure user object has roles array
      if (!response.user || !response.user.roles || !Array.isArray(response.user.roles)) {
        console.error('Invalid user response:', response);
        toast.error('Invalid user data received');
        return;
      }

      setAuth(response.user, response.tokens.accessToken, response.tokens.refreshToken);
      toast.success('Login successful!');

      // ✅ Redirect based on role - check if user is admin
      const isAdmin = response.user.roles.includes(UserRole.PLATFORM_ADMIN);
      
      if (isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = authApi.getGoogleLoginUrl();
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 px-8 py-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to BharatSetu</h1>
          <p className="text-blue-100 mt-2 text-sm">
            Unified Portal for Government Services
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          {step === 'mobile' ? (
            <form onSubmit={mobileForm.handleSubmit(handleSendOtp)} className="space-y-6">
              <div>
                <Input
                  label="Mobile Number"
                  placeholder="Enter your 10-digit mobile number"
                  leftIcon={<Phone size={18} />}
                  error={mobileForm.formState.errors.mobile?.message}
                  {...mobileForm.register('mobile')}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
                rightIcon={<ArrowRight size={18} />}
              >
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-6">
              <div className="text-center mb-4">
                <p className="text-sm text-slate-600">
                  OTP sent to <span className="font-semibold">+91 {mobile}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setStep('mobile')}
                  className="text-sm text-blue-600 hover:underline mt-1"
                >
                  Change number
                </button>
              </div>

              <div>
                <Input
                  label="Enter OTP"
                  placeholder="Enter 6-digit OTP"
                  leftIcon={<Lock size={18} />}
                  maxLength={6}
                  error={otpForm.formState.errors.otp?.message}
                  {...otpForm.register('otp')}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
                rightIcon={<ArrowRight size={18} />}
              >
                Verify & Login
              </Button>

              <button
                type="button"
                onClick={() => handleSendOtp({ mobile })}
                disabled={isLoading}
                className="w-full text-sm text-slate-600 hover:text-blue-600 transition-colors"
              >
                Resend OTP
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
          <Link href="/" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
