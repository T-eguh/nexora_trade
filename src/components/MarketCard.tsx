import React from 'react';
import { Market } from '../types';
import { Card } from './Card';
import { Badge } from './Badge';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

export interface MarketCardProps {
  market: Market;
  onSelect?: (market: Market) => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, onSelect }) => {
  const isPositive = market.change >= 0;

  // Simple SVG sparkline
  const min = Math.min(...market.sparkline);
  const max = Math.max(...market.sparkline);
  const range = max - min || 1;
  const points = market.sparkline
    .map((val, i) => {
      const x = (i / (market.sparkline.length - 1)) * 100;
      const y = 35 - ((val - min) / range) * 25;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Card hoverEffect padding="sm" className="flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight">{market.symbol}</span>
              <Badge variant="neutral" size="sm">
                {market.category}
              </Badge>
            </div>
            <p className="text-xs text-neutral-400 truncate max-w-[170px] mt-0.5">{market.name}</p>
          </div>
          <div
            className={`flex items-center gap-0.5 text-xs font-semibold font-mono-num px-2 py-0.5 rounded ${
              isPositive
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                : 'bg-red-950/60 text-red-400 border border-red-800/60'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3 shrink-0" />
            ) : (
              <TrendingDown className="w-3 h-3 shrink-0" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {market.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 my-3 p-2.5 bg-[#151518] rounded-lg border border-neutral-800/80 font-mono-num text-xs">
          <div>
            <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Bid</span>
            <span className="font-bold text-neutral-200">{market.bid.toFixed(market.digits)}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Ask</span>
            <span className="font-bold text-neutral-200">{market.ask.toFixed(market.digits)}</span>
          </div>
        </div>

        {/* Mini Sparkline */}
        <div className="h-10 w-full overflow-hidden my-1">
          <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>

      <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
        <span>Spread: <strong className="text-neutral-300 font-mono-num">{market.spread} pips</strong></span>
        {onSelect && (
          <button
            onClick={() => onSelect(market)}
            className="text-red-400 group-hover:text-red-300 font-medium flex items-center gap-1 hover:underline cursor-pointer"
          >
            Inspect <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </Card>
  );
};
