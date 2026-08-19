import React, { useState, useEffect } from 'react';
import { Market, Position } from '../types';
import { Badge } from './Badge';
import { Button } from './Button';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../utils/storage';

const MOCK_TICKERS: { symbol: string; name: string; basePrice: number; digits: number; spread: number }[] = [
  { symbol: 'XAU/USD', name: 'Spot Gold', basePrice: 2684.50, digits: 2, spread: 0.35 },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', basePrice: 1.08450, digits: 5, spread: 0.00014 },
  { symbol: 'GBP/USD', name: 'British Pound', basePrice: 1.29340, digits: 5, spread: 0.00018 },
  { symbol: 'BTC/USD', name: 'Bitcoin', basePrice: 67820.00, digits: 2, spread: 25.0 },
];

// Sample candle generator
const generateCandles = (basePrice: number) => {
  const candles = [];
  let current = basePrice * 0.995;
  for (let i = 0; i < 20; i++) {
    const change = (Math.random() - 0.48) * (basePrice * 0.004);
    const open = current;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.002);
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.002);
    candles.push({ open, high, low, close, isBull: close >= open });
    current = close;
  }
  return candles;
};

export const TradingTerminalMock: React.FC = () => {
  const [selectedTicker, setSelectedTicker] = useState(MOCK_TICKERS[0]);
  const [volume, setVolume] = useState('0.10');
  const [candles, setCandles] = useState(() => generateCandles(MOCK_TICKERS[0].basePrice));
  const [priceOffset, setPriceOffset] = useState(0);
  const [lastTradeMsg, setLastTradeMsg] = useState<string | null>(null);

  // Simulated live ticking
  useEffect(() => {
    setCandles(generateCandles(selectedTicker.basePrice));
    const interval = setInterval(() => {
      setPriceOffset((prev) => {
        const delta = (Math.random() - 0.5) * (selectedTicker.basePrice * 0.0006);
        return prev + delta;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedTicker]);

  const currentPrice = selectedTicker.basePrice + priceOffset;
  const bid = currentPrice;
  const ask = currentPrice + selectedTicker.spread;
  const isUp = priceOffset >= 0;

  const handleExecuteTrade = (type: 'BUY' | 'SELL') => {
    const pos: Omit<Position, 'id' | 'openTime'> = {
      accountId: 'NX-894102',
      symbol: selectedTicker.symbol,
      type,
      volume: parseFloat(volume) || 0.1,
      openPrice: type === 'BUY' ? ask : bid,
      currentPrice: type === 'BUY' ? ask : bid,
      pnl: 0,
      status: 'open',
    };
    StorageService.addPosition(pos);
    setLastTradeMsg(`Executed DEMO ${type} ${volume} lot(s) @ ${type === 'BUY' ? ask.toFixed(selectedTicker.digits) : bid.toFixed(selectedTicker.digits)}`);
    setTimeout(() => setLastTradeMsg(null), 4000);
  };

  // SVG dimensions for candlestick chart
  const minCandle = Math.min(...candles.map((c) => c.low));
  const maxCandle = Math.max(...candles.map((c) => c.high));
  const candleRange = maxCandle - minCandle || 1;

  return (
    <div className="w-full bg-[#0D0D0F] border border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        {/* Ticker selector tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {MOCK_TICKERS.map((t) => (
            <button
              key={t.symbol}
              onClick={() => setSelectedTicker(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedTicker.symbol === t.symbol
                  ? 'bg-[#1e1e24] text-white border border-neutral-700 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              {t.symbol}
            </button>
          ))}
        </div>

        <Badge variant="red" size="sm">
          DEMO MARKET DATA
        </Badge>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-neutral-800/80 font-mono-num text-xs">
        <div className="bg-[#151518] p-3 rounded-lg border border-neutral-800">
          <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Demo Balance</span>
          <span className="text-base font-bold text-white">$10,540.25</span>
        </div>
        <div className="bg-[#151518] p-3 rounded-lg border border-neutral-800">
          <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Demo Equity</span>
          <span className="text-base font-bold text-white">$10,865.75</span>
        </div>
        <div className="bg-[#151518] p-3 rounded-lg border border-neutral-800">
          <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Floating P/L</span>
          <span className="text-base font-bold text-emerald-400">+$325.50</span>
        </div>
        <div className="bg-[#151518] p-3 rounded-lg border border-neutral-800">
          <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Free Margin</span>
          <span className="text-base font-bold text-white">$10,445.75</span>
        </div>
      </div>

      {/* Terminal Chart and Execution Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-4">
        {/* Interactive Candlestick SVG Area */}
        <div className="lg:col-span-2 bg-[#050505] p-3 rounded-xl border border-neutral-800/80 flex flex-col justify-between h-56">
          <div className="flex items-center justify-between text-xs font-mono-num mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{selectedTicker.symbol}</span>
              <span className="text-neutral-400">15M</span>
              <span className={isUp ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                {currentPrice.toFixed(selectedTicker.digits)}
              </span>
            </div>
            <div className="text-neutral-400 text-[11px]">
              O: {candles[candles.length - 1]?.open.toFixed(selectedTicker.digits)} H:{' '}
              {candles[candles.length - 1]?.high.toFixed(selectedTicker.digits)} L:{' '}
              {candles[candles.length - 1]?.low.toFixed(selectedTicker.digits)}
            </div>
          </div>

          {/* SVG Candlestick render */}
          <div className="w-full h-40">
            <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="400" y2="30" stroke="#27272a" strokeDasharray="3 3" strokeWidth="0.5" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="#27272a" strokeDasharray="3 3" strokeWidth="0.5" />
              <line x1="0" y1="90" x2="400" y2="90" stroke="#27272a" strokeDasharray="3 3" strokeWidth="0.5" />

              {candles.map((candle, idx) => {
                const candleWidth = 12;
                const gap = (400 - candles.length * candleWidth) / (candles.length + 1);
                const x = gap + idx * (candleWidth + gap);

                const openY = 110 - ((candle.open - minCandle) / candleRange) * 100;
                const closeY = 110 - ((candle.close - minCandle) / candleRange) * 100;
                const highY = 110 - ((candle.high - minCandle) / candleRange) * 100;
                const lowY = 110 - ((candle.low - minCandle) / candleRange) * 100;

                const bodyTop = Math.min(openY, closeY);
                const bodyHeight = Math.max(Math.abs(closeY - openY), 2);
                const color = candle.isBull ? '#10b981' : '#ef4444';

                return (
                  <g key={idx}>
                    {/* Wick */}
                    <line x1={x + candleWidth / 2} y1={highY} x2={x + candleWidth / 2} y2={lowY} stroke={color} strokeWidth="1.2" />
                    {/* Body */}
                    <rect x={x} y={bodyTop} width={candleWidth} height={bodyHeight} fill={color} rx="1" />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Trade Execution Controls */}
        <div className="bg-[#151518] p-4 rounded-xl border border-neutral-800 flex flex-col justify-between space-y-3">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Order Volume (Lots)
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setVolume((prev) => Math.max(0.01, +(parseFloat(prev) - 0.05).toFixed(2)).toString())}
                className="w-8 h-9 rounded bg-[#27272a] text-neutral-200 hover:text-white font-bold cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="50"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full bg-[#0D0D0F] border border-neutral-800 rounded py-1.5 px-3 text-center text-sm font-mono-num text-white focus:outline-none focus:border-red-500"
              />
              <button
                type="button"
                onClick={() => setVolume((prev) => +(parseFloat(prev) + 0.05).toFixed(2).toString())}
                className="w-8 h-9 rounded bg-[#27272a] text-neutral-200 hover:text-white font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono-num">
            {/* SELL Button */}
            <button
              onClick={() => handleExecuteTrade('SELL')}
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-white transition-colors cursor-pointer group"
            >
              <span className="flex items-center gap-1 text-xs font-bold text-red-400 group-hover:text-red-300">
                <ArrowDownRight className="w-3.5 h-3.5" /> SELL
              </span>
              <span className="text-sm font-extrabold mt-0.5">{bid.toFixed(selectedTicker.digits)}</span>
            </button>

            {/* BUY Button */}
            <button
              onClick={() => handleExecuteTrade('BUY')}
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-white transition-colors cursor-pointer group"
            >
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                <ArrowUpRight className="w-3.5 h-3.5" /> BUY
              </span>
              <span className="text-sm font-extrabold mt-0.5">{ask.toFixed(selectedTicker.digits)}</span>
            </button>
          </div>

          {lastTradeMsg && (
            <div className="p-2 rounded bg-neutral-900 border border-neutral-700 text-[11px] text-neutral-200 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{lastTradeMsg}</span>
            </div>
          )}

          <div className="text-[10px] text-neutral-400 text-center">
            Simulated Instant Execution • Direct Demo Bridge
          </div>
        </div>
      </div>
    </div>
  );
};
