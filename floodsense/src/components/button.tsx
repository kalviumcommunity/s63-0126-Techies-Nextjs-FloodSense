import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-full font-semibold tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'h-9 px-4 text-xs',
    md: 'h-11 px-5 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:-translate-y-px',
    secondary:
      'bg-secondary text-secondary-foreground hover:-translate-y-px',
    outline:
      'border border-border bg-transparent text-foreground hover:bg-muted hover:-translate-y-px',
    ghost:
      'bg-transparent text-foreground hover:bg-muted',
    danger:
      'bg-danger text-white shadow-sm hover:shadow-md hover:-translate-y-px',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
