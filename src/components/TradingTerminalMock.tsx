import React, { useState } from 'react';
import { Badge } from './Badge';
import { TradingViewChart } from './TradingViewChart';
import { StorageService } from '../utils/storage';
import { Position } from '../types';
import { ShieldCheck, Zap } from 'lucide-react';

const POPULAR_TICKERS = [
  { symbol: 'XAUUSD', name: 'Emas (Spot Gold)', category: 'Komoditas' },
  { symbol: 'EURUSD', name: 'Euro / US Dollar', category: 'Forex' },
  { symbol: 'GBPUSD', name: 'Pound Inggris / USD', category: 'Forex' },
  { symbol: 'BTCUSD', name: 'Bitcoin / USD', category: 'Kripto' },
  { symbol: 'USOIL', name: 'Minyak Mentah (WTI)', category: 'Energi' },
  { symbol: 'US500', name: 'S&P 500 Index', category: 'Indeks' },
];

export const TradingTerminalMock: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(POPULAR_TICKERS[0].symbol);
  const [volume, setVolume] = useState('0.10');
  const [lastTradeMsg, setLastTradeMsg] = useState<string | null>(null);

  const handleExecuteTrade = (type: 'BUY' | 'SELL') => {
    const pos: Omit<Position, 'id' | 'openTime'> = {
      accountId: 'NX-894102',
      symbol: selectedSymbol,
      type,
      volume: parseFloat(volume) || 0.1,
      openPrice: 0,
      currentPrice: 0,
      pnl: 0,
      status: 'open',
    };
    StorageService.addPosition(pos);
    setLastTradeMsg(`Order ${type} ${volume} lot ${selectedSymbol} berhasil dieksekusi ke Server US New York Live`);
    setTimeout(() => setLastTradeMsg(null), 4000);
  };

  return (
    <div className="w-full bg-[#0D0D0F] border border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        {/* Ticker selector tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {POPULAR_TICKERS.map((t) => (
            <button
              key={t.symbol}
              onClick={() => setSelectedSymbol(t.symbol)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedSymbol === t.symbol
                  ? 'bg-[#1e1e24] text-white border border-neutral-700 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              {t.symbol}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Badge variant="emerald" size="sm">
            US AMERIKAN STP LIVE
          </Badge>
        </div>
      </div>

      {/* Main Real Chart Canvas */}
      <div className="py-4 space-y-4">
        <TradingViewChart
          symbol={selectedSymbol}
          theme="dark"
          interval="15"
          height={460}
        />

        {/* Trade Execution Toolbar */}
        <div className="bg-[#151518] p-4 rounded-xl border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-semibold">Volume Lot:</span>
            {['0.01', '0.05', '0.10', '0.50', '1.00'].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setVolume(l)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors ${
                  volume === l
                    ? 'bg-red-600 text-white border-red-500'
                    : 'bg-[#20232d] text-neutral-300 border-neutral-700 hover:bg-[#2a2e3b]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleExecuteTrade('SELL')}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 cursor-pointer"
            >
              Jual (SELL)
            </button>
            <button
              type="button"
              onClick={() => handleExecuteTrade('BUY')}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 cursor-pointer"
            >
              Beli (BUY)
            </button>
          </div>
        </div>

        {lastTradeMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-medium text-center animate-fadeIn">
            {lastTradeMsg}
          </div>
        )}
      </div>
    </div>
  );
};
