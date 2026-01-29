import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Card({ title, children, footer, className = '' }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <div className="text-gray-700 dark:text-gray-300">
        {children}
      </div>
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
}
