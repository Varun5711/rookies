'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  secondary: 'bg-orange-100 text-orange-700',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = ''
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {children}
    </span>
  );
}

// Status-specific badges
export function StatusBadge({ status, className = '' }: { status: string; className?: string }) {
  const getVariant = (): BadgeProps['variant'] => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'submitted':
        return 'warning';
      case 'confirmed':
      case 'approved':
      case 'completed':
      case 'resolved':
      case 'disbursed':
        return 'success';
      case 'in_progress':
      case 'under_review':
      case 'acknowledged':
        return 'info';
      case 'cancelled':
      case 'rejected':
      case 'no_show':
        return 'danger';
      case 'escalated':
      case 'pending_info':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatStatus = (s: string) => {
    return s
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Badge variant={getVariant()} className={className}>
      {formatStatus(status)}
    </Badge>
  );
}
