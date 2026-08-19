import React, { useState } from 'react';
import { MarketTable } from '../../components/MarketTable';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useMarkets, useAccounts, useAuth } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { Market, Position } from '../../types';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardMarketsPage: React.FC = () => {
  const { markets } = useMarkets();
  const { accounts } = useAccounts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tradeModalMarket, setTradeModalMarket] = useState<Market | null>(null);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [volume, setVolume] = useState('0.10');
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');
  const [tradeSuccessMsg, setTradeSuccessMsg] = useState<string | null>(null);

  const primaryAccount = accounts.find((a) => a.userId === user?.id) || accounts[0];

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
      accountId: primaryAccount?.accountNumber || 'NX-894102',
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
    setTradeSuccessMsg(`Demo ${tradeType} order of ${vol} lot(s) on ${tradeModalMarket.symbol} executed!`);
    setTimeout(() => {
      setTradeModalMarket(null);
      setTradeSuccessMsg(null);
      navigate('/dashboard/positions');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Client Market Watch
        </h1>
        <p className="text-xs text-neutral-400">
          Direct interbank quotes with 1-click execution to open long or short demo contracts.
        </p>
      </div>

      <MarketTable
        markets={markets}
        showSearch
        showCategoryFilter
        onTradeClick={handleOpenTrade}
      />

      {/* Trade Modal */}
      {tradeModalMarket && (
        <Modal
          isOpen={!!tradeModalMarket}
          onClose={() => setTradeModalMarket(null)}
          title={`Order Placement — ${tradeModalMarket.symbol}`}
        >
          {tradeSuccessMsg ? (
            <div className="p-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Order Executed</h4>
              <p className="text-xs text-neutral-300">{tradeSuccessMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleConfirmTrade} className="space-y-4">
              <div className="p-3 bg-[#151518] rounded-xl border border-neutral-800 flex items-center justify-between text-xs font-mono-num">
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Account</span>
                  <strong className="text-white">{primaryAccount?.accountNumber}</strong>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 block text-[10px] uppercase">Quote Price</span>
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
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold font-mono-num transition-colors cursor-pointer ${
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
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold font-mono-num transition-colors cursor-pointer ${
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
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Stop Loss"
                  type="number"
                  step="any"
                  placeholder="e.g. 1.0820"
                  value={sl}
                  onChange={(e) => setSl(e.target.value)}
                />
                <Input
                  label="Take Profit"
                  type="number"
                  step="any"
                  placeholder="e.g. 1.0920"
                  value={tp}
                  onChange={(e) => setTp(e.target.value)}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
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
