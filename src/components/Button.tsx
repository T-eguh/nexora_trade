import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap shrink-0 rounded-lg cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs py-1.5 px-3 gap-1.5 min-h-[36px]',
    md: 'text-sm py-2 px-4 gap-2 min-h-[40px]',
    lg: 'text-base py-2.5 px-6 gap-2.5 min-h-[46px]',
  };

  const variantStyles = {
    primary: 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 font-semibold shadow-sm',
    secondary: 'bg-[#18181b] text-neutral-200 hover:bg-[#27272a] hover:text-white border border-neutral-800',
    outline: 'bg-transparent text-neutral-300 hover:text-white hover:bg-neutral-900 border border-neutral-700',
    danger: 'bg-red-950/60 text-red-300 hover:bg-red-900/80 border border-red-800/80',
    ghost: 'bg-transparent text-neutral-400 hover:text-white hover:bg-neutral-900',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
