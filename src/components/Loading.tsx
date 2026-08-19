import React from 'react';

export interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading data...',
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div
        className={`${sizeMap[size]} border-red-500 border-t-transparent rounded-full animate-spin`}
      />
      {message && <p className="text-xs text-neutral-400">{message}</p>}
    </div>
  );
};
