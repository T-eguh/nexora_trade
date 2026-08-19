import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-neutral-300 tracking-wide uppercase">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full bg-[#151518] text-white text-sm rounded-lg border ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-neutral-800 focus:border-red-500 focus:ring-red-500/20'
          } py-2.5 px-3.5 focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:bg-neutral-900 cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#151518] text-white">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-neutral-400 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
