import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load live data',
  message = 'Showing local demo data. All interactive features remain functional.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center bg-red-950/20 border border-red-900/40 rounded-xl ${className}`}>
      <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800/80 flex items-center justify-center text-red-400 mb-3">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-red-300 mb-1">{title}</h4>
      <p className="text-xs text-neutral-400 max-w-md mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Retry Connection
        </Button>
      )}
    </div>
  );
};
