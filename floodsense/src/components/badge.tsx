import React from 'react';

type BadgeVariant = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  const styles: Record<BadgeVariant, string> = {
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-400/20 dark:text-blue-200',
    success: 'bg-green-100 text-green-700 dark:bg-green-400/20 dark:text-green-200',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-400/20 dark:text-amber-200',
    danger: 'bg-red-100 text-red-700 dark:bg-red-400/20 dark:text-red-200',
    neutral: 'bg-muted text-muted-foreground',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
