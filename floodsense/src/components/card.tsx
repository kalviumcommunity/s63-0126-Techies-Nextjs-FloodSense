import React from 'react';

interface CardProps {
  title?: string;
  eyebrow?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function Card({
  title,
  eyebrow,
  description,
  children,
  footer,
  className = '',
  action,
}: CardProps) {
  return (
    <div
      className={`bg-card text-card-foreground rounded-2xl border border-border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${className}`}
    >
      {(eyebrow || title || description || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {eyebrow}
              </p>
            )}
            {title && (
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="text-sm text-muted-foreground">{children}</div>
      {footer && (
        <div className="mt-5 border-t border-border pt-4">{footer}</div>
      )}
    </div>
  );
}
