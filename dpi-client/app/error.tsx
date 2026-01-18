'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="text-red-600" size={40} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong!</h1>
        <p className="text-slate-500 mb-8">
          We encountered an unexpected error. Please try again or go back to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} leftIcon={<RefreshCw size={18} />}>
            Try Again
          </Button>
          <Button variant="outline" leftIcon={<Home size={18} />} onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
