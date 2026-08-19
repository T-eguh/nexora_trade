import React from 'react';

export interface BadgeProps {
  variant?: 'neutral' | 'success' | 'danger' | 'warning' | 'info' | 'red';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantStyles = {
    neutral: 'bg-neutral-800 text-neutral-300 border border-neutral-700',
    success: 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80',
    danger: 'bg-red-950/80 text-red-300 border border-red-800/80',
    warning: 'bg-amber-950/80 text-amber-300 border border-amber-800/80',
    info: 'bg-sky-950/80 text-sky-300 border border-sky-800/80',
    red: 'bg-red-600/20 text-red-400 border border-red-500/30',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full whitespace-nowrap shrink-0 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
