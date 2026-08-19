import React, { useState } from 'react';
import { useMarkets, useAuth } from '../../hooks/useStorage';
import { MarketTable } from '../../components/MarketTable';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Market, Position } from '../../types';
import { StorageService } from '../../utils/storage';
import { CheckCircle2, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MarketsPage: React.FC = () => {
  const { markets } = useMarkets();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [tradeModalMarket, setTradeModalMarket] = useState<Market | null>(null);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [volume, setVolume] = useState('0.10');
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');
  const [tradeSuccessMsg, setTradeSuccessMsg] = useState<string | null>(null);

  const handleOpenTrade = (market: Market, type: 'BUY' | 'SELL') => {
    setTradeModalMarket(market);
    setTradeType(type);
    setTradeSuccessMsg(null);
  };

  const handleConfirmTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tradeModalMarket) return;

    const vol = parseFloat(volume) || 0.1;
    const price = tradeType === 'BUY' ? tradeModalMarket.ask : tradeModalMarket.bid;

    const pos: Omit<Position, 'id' | 'openTime'> = {
      accountId: 'NX-894102',
      symbol: tradeModalMarket.symbol,
      type: tradeType,
      volume: vol,
      openPrice: price,
      currentPrice: price,
      sl: sl ? parseFloat(sl) : undefined,
      tp: tp ? parseFloat(tp) : undefined,
      pnl: 0,
      status: 'open',
    };

    StorageService.addPosition(pos);
    setTradeSuccessMsg(`Demo ${tradeType} position of ${vol} lot(s) on ${tradeModalMarket.symbol} placed successfully!`);
    setTimeout(() => {
      setTradeModalMarket(null);
      setTradeSuccessMsg(null);
    }, 2500);
  };

  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="red" size="md">
          LIVE DEMO PRICING
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Global Markets Explorer
        </h1>
        <p className="text-sm sm:text-base text-neutral-300">
          Track real-time streaming market prices across Forex, Metals, Indices, Commodities, and Crypto. Inspect volatility, spreads, and test market order execution.
        </p>
      </div>

      {/* Main Interactive Market Table */}
      <Card padding="md">
        <MarketTable
          markets={markets}
          title="Streaming Financial Instruments"
          subtitle="Real-time simulated interbank quote feeds with sub-millisecond execution modeling."
          showSearch
          showCategoryFilter
          onTradeClick={handleOpenTrade}
        />
      </Card>

      {/* Order Execution Modal */}
      {tradeModalMarket && (
        <Modal
          isOpen={!!tradeModalMarket}
          onClose={() => setTradeModalMarket(null)}
          title={`Execute Demo Order — ${tradeModalMarket.symbol}`}
        >
          {tradeSuccessMsg ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Order Executed</h4>
              <p className="text-xs text-neutral-300">{tradeSuccessMsg}</p>
              <div className="pt-3">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate('/dashboard/positions')}
                >
                  View in Client Dashboard
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConfirmTrade} className="space-y-4">
              <div className="p-3 bg-[#151518] rounded-xl border border-neutral-800 flex items-center justify-between text-xs font-mono-num">
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Order Type</span>
                  <span
                    className={`font-bold ${
                      tradeType === 'BUY' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    DEMO {tradeType}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 block text-[10px] uppercase">Execution Price</span>
                  <span className="text-sm font-bold text-white">
                    {tradeType === 'BUY'
                      ? tradeModalMarket.ask.toFixed(tradeModalMarket.digits)
                      : tradeModalMarket.bid.toFixed(tradeModalMarket.digits)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTradeType('SELL')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold font-mono-num transition-colors cursor-pointer ${
                    tradeType === 'SELL'
                      ? 'bg-red-600 text-white'
                      : 'bg-[#151518] text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  SELL {tradeModalMarket.bid.toFixed(tradeModalMarket.digits)}
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType('BUY')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold font-mono-num transition-colors cursor-pointer ${
                    tradeType === 'BUY'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#151518] text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  BUY {tradeModalMarket.ask.toFixed(tradeModalMarket.digits)}
                </button>
              </div>

              <Input
                label="Volume (Lots)"
                type="number"
                step="0.01"
                min="0.01"
                max="50"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                required
                helperText="1 Standard Lot = 100,000 units"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Stop Loss (Optional)"
                  type="number"
                  step="any"
                  placeholder="e.g. 1.0800"
                  value={sl}
                  onChange={(e) => setSl(e.target.value)}
                />
                <Input
                  label="Take Profit (Optional)"
                  type="number"
                  step="any"
                  placeholder="e.g. 1.0920"
                  value={tp}
                  onChange={(e) => setTp(e.target.value)}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setTradeModalMarket(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={tradeType === 'BUY' ? 'primary' : 'danger'}
                  className={tradeType === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-500' : ''}
                >
                  Confirm Demo {tradeType}
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
