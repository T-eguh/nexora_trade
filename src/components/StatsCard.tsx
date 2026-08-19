import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from './Card';

export interface StatsCardProps {
  title?: string;
  label?: string;
  value: string | number;
  subtitle?: string;
  subValue?: string;
  change?: string;
  isPositive?: boolean;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon?: LucideIcon | React.ReactNode;
  accentColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  label,
  value,
  subtitle,
  subValue,
  change,
  isPositive,
  trend,
  icon,
}) => {
  const displayLabel = title || label || '';
  const displaySub = subtitle || subValue;
  const trendValue = trend?.value || change;
  const trendPositive = trend?.isPositive ?? isPositive ?? true;

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return icon;
    }
    if (typeof icon === 'function') {
      const IconComponent = icon as LucideIcon;
      return <IconComponent className="w-5 h-5" />;
    }
    return null;
  };

  return (
    <Card padding="sm" className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            {displayLabel}
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-mono-num tracking-tight">
            {value}
          </h3>
          {displaySub && (
            <p className="text-xs text-neutral-400 mt-1 font-mono-num">{displaySub}</p>
          )}
          {trendValue && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-semibold font-mono-num ${
                  trendPositive ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {trendValue}
              </span>
              <span className="text-[11px] text-neutral-500">vs period</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2.5 rounded-lg bg-[#151518] text-neutral-300 border border-neutral-800 shrink-0">
            {renderIcon()}
          </div>
        )}
      </div>
    </Card>
  );
};
