import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  padding = 'md',
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`bg-[#0D0D0F] border border-neutral-800/80 rounded-xl transition-all ${
        hoverEffect ? 'hover:border-neutral-700 hover:shadow-lg hover:shadow-black/40' : ''
      } ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
};
