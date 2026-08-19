import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-neutral-300 tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-neutral-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full bg-[#151518] text-white placeholder-neutral-500 text-sm rounded-lg border ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-neutral-800 focus:border-red-500 focus:ring-red-500/20'
            } py-2.5 ${leftIcon ? 'pl-10' : 'pl-3.5'} ${rightIcon ? 'pr-10' : 'pr-3.5'} focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:bg-neutral-900 ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-neutral-400 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-neutral-400 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
