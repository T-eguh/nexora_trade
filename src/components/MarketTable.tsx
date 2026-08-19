import React, { useState } from 'react';
import { Market, MarketCategory } from '../types';
import { Table, Column } from './Table';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { Badge } from './Badge';
import { Search, TrendingUp, TrendingDown, Eye, Activity } from 'lucide-react';

export interface MarketTableProps {
  markets: Market[];
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showCategoryFilter?: boolean;
  onTradeClick?: (market: Market, type: 'BUY' | 'SELL') => void;
}

export const MarketTable: React.FC<MarketTableProps> = ({
  markets,
  title,
  subtitle,
  showSearch = true,
  showCategoryFilter = true,
  onTradeClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeMarket, setActiveMarket] = useState<Market | null>(null);

  const categories: (string)[] = ['ALL', 'Forex', 'Metals', 'Indices', 'Commodities', 'Crypto'];

  const filteredMarkets = markets.filter((m) => {
    const matchSearch =
      m.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || m.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const columns: Column<Market>[] = [
    {
      header: 'Instrument',
      render: (m) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-xs text-white">
            {m.symbol.split('/')[0].substring(0, 3)}
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>{m.symbol}</span>
              <Badge variant="neutral" size="sm">
                {m.category}
              </Badge>
            </div>
            <p className="text-xs text-neutral-400 font-sans">{m.name}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Bid',
      align: 'right',
      render: (m) => <span className="text-neutral-200 font-medium">{m.bid.toFixed(m.digits)}</span>,
    },
    {
      header: 'Ask',
      align: 'right',
      render: (m) => <span className="text-neutral-200 font-medium">{m.ask.toFixed(m.digits)}</span>,
    },
    {
      header: '24h Change',
      align: 'right',
      render: (m) => {
        const isPos = m.change >= 0;
        return (
          <span
            className={`inline-flex items-center gap-1 font-semibold ${
              isPos ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {isPos ? '+' : ''}
            {m.changePercent.toFixed(2)}%
          </span>
        );
      },
    },
    {
      header: '24h High',
      align: 'right',
      render: (m) => <span className="text-neutral-400">{m.high.toFixed(m.digits)}</span>,
    },
    {
      header: '24h Low',
      align: 'right',
      render: (m) => <span className="text-neutral-400">{m.low.toFixed(m.digits)}</span>,
    },
    {
      header: 'Spread',
      align: 'right',
      render: (m) => <span className="text-neutral-300">{m.spread} pips</span>,
    },
    {
      header: 'Actions',
      align: 'center',
      render: (m) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setActiveMarket(m)}
            className="py-1 px-2.5 h-8 text-xs"
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> View
          </Button>
          {onTradeClick && (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="danger"
                onClick={() => onTradeClick(m, 'SELL')}
                className="py-1 px-2.5 h-8 text-xs bg-red-950/80 text-red-300 border border-red-800/80 hover:bg-red-900"
              >
                Sell
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => onTradeClick(m, 'BUY')}
                className="py-1 px-2.5 h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Buy
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {(title || subtitle) && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            {title && <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-neutral-400">{subtitle}</p>}
          </div>
          <Badge variant="red" size="sm">
            DEMO MARKET DATA
          </Badge>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0D0D0F] p-3 rounded-xl border border-neutral-800">
        {showCategoryFilter && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white'
                    : 'bg-[#151518] text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {showSearch && (
          <div className="w-full md:w-64">
            <Input
              placeholder="Search symbol (e.g. EUR, XAU)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
              className="py-1.5 text-xs"
            />
          </div>
        )}
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredMarkets}
        keyExtractor={(m) => m.id}
        emptyMessage="No trading instruments found matching your filter criteria."
      />

      {/* Interactive Market Detail Modal */}
      {activeMarket && (
        <Modal
          isOpen={!!activeMarket}
          onClose={() => setActiveMarket(null)}
          title={`${activeMarket.symbol} — Market Overview`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xl font-bold text-white">{activeMarket.name}</h4>
                <p className="text-xs text-neutral-400 mt-0.5">{activeMarket.description}</p>
              </div>
              <Badge variant="red" size="sm">
                {activeMarket.category}
              </Badge>
            </div>

            {/* Price Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#151518] p-4 rounded-xl border border-neutral-800 font-mono-num text-center">
              <div>
                <span className="text-neutral-500 text-xs uppercase font-semibold block">Bid</span>
                <span className="text-lg font-bold text-white">
                  {activeMarket.bid.toFixed(activeMarket.digits)}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 text-xs uppercase font-semibold block">Ask</span>
                <span className="text-lg font-bold text-white">
                  {activeMarket.ask.toFixed(activeMarket.digits)}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 text-xs uppercase font-semibold block">24h High</span>
                <span className="text-lg font-bold text-emerald-400">
                  {activeMarket.high.toFixed(activeMarket.digits)}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 text-xs uppercase font-semibold block">24h Low</span>
                <span className="text-lg font-bold text-red-400">
                  {activeMarket.low.toFixed(activeMarket.digits)}
                </span>
              </div>
            </div>

            {/* Simulated SVG Mini Chart */}
            <div className="p-4 bg-[#050505] rounded-xl border border-neutral-800/80">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                <span className="flex items-center gap-1 font-semibold text-neutral-300">
                  <Activity className="w-4 h-4 text-red-500" /> Simulated Trend (M15)
                </span>
                <span className="font-mono-num">Spread: {activeMarket.spread} pips</span>
              </div>
              <div className="h-32 w-full">
                <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Candlestick / Area representation */}
                  <polygon
                    fill="url(#chartGradient)"
                    points={`0,100 ${activeMarket.sparkline
                      .map((v, i) => {
                        const x = (i / (activeMarket.sparkline.length - 1)) * 300;
                        const min = Math.min(...activeMarket.sparkline);
                        const max = Math.max(...activeMarket.sparkline);
                        const y = 90 - ((v - min) / (max - min || 1)) * 75;
                        return `${x},${y}`;
                      })
                      .join(' ')} 300,100`}
                  />
                  <polyline
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    points={activeMarket.sparkline
                      .map((v, i) => {
                        const x = (i / (activeMarket.sparkline.length - 1)) * 300;
                        const min = Math.min(...activeMarket.sparkline);
                        const max = Math.max(...activeMarket.sparkline);
                        const y = 90 - ((v - min) / (max - min || 1)) * 75;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setActiveMarket(null)}>
                Close
              </Button>
              {onTradeClick && (
                <>
                  <Button
                    variant="danger"
                    onClick={() => {
                      onTradeClick(activeMarket, 'SELL');
                      setActiveMarket(null);
                    }}
                  >
                    Sell {activeMarket.symbol}
                  </Button>
                  <Button
                    variant="primary"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white"
                    onClick={() => {
                      onTradeClick(activeMarket, 'BUY');
                      setActiveMarket(null);
                    }}
                  >
                    Buy {activeMarket.symbol}
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
