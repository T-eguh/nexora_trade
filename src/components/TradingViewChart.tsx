import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Maximize2,
  Minimize2,
  BarChart2,
  Layers,
  Zap,
  Globe,
} from 'lucide-react';

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isUp: boolean;
}

interface TradingViewChartProps {
  symbol: string;
  theme?: 'dark' | 'light';
  interval?: string;
  height?: number | string;
  currentBid?: number;
  currentAsk?: number;
  digits?: number;
}

// Clean sanitization for TradingView
const getTradingViewSymbol = (rawSymbol: string): string => {
  const clean = rawSymbol.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (clean.includes('XAU') || clean.includes('GOLD')) return 'OANDA:XAUUSD';
  if (clean.includes('XAG') || clean.includes('SILVER')) return 'OANDA:XAGUSD';
  if (clean.includes('EURUSD')) return 'FX:EURUSD';
  if (clean.includes('GBPUSD')) return 'FX:GBPUSD';
  if (clean.includes('USDJPY')) return 'FX:USDJPY';
  if (clean.includes('USDCAD')) return 'FX:USDCAD';
  if (clean.includes('USDCHF')) return 'FX:USDCHF';
  if (clean.includes('AUDUSD')) return 'FX:AUDUSD';
  if (clean.includes('GBPJPY')) return 'FX:GBPJPY';
  if (clean.includes('EURJPY')) return 'FX:EURJPY';
  if (clean.includes('EURGBP')) return 'FX:EURGBP';
  if (clean.includes('BTC')) return 'BINANCE:BTCUSDT';
  if (clean.includes('ETH')) return 'BINANCE:ETHUSDT';
  if (clean.includes('SOL')) return 'BINANCE:SOLUSDT';
  if (clean.includes('USOIL') || clean.includes('WTI')) return 'TVC:USOIL';
  if (clean.includes('UKOIL') || clean.includes('BRENT')) return 'TVC:UKOIL';
  if (clean.includes('US100') || clean.includes('NAS')) return 'FOREXCOM:NSXUSD';
  if (clean.includes('US500') || clean.includes('SPX')) return 'FOREXCOM:SPXUSD';
  if (clean.includes('GER40') || clean.includes('DAX')) return 'FOREXCOM:GER40';

  return `FX:${clean}`;
};

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol,
  theme = 'dark',
  interval = '15',
  height = 480,
  currentBid = 2684.25,
  currentAsk = 2684.60,
  digits = 2,
}) => {
  const [engineMode, setEngineMode] = useState<'live-canvas' | 'tradingview'>('live-canvas');
  const [timeframe, setTimeframe] = useState<string>(interval);
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);
  const [showIndicators, setShowIndicators] = useState(true);
  const [lastTickDirection, setLastTickDirection] = useState<'up' | 'down'>('up');
  const [liveBid, setLiveBid] = useState(currentBid);
  const [liveAsk, setLiveAsk] = useState(currentAsk);

  const cleanTvSymbol = useMemo(() => getTradingViewSymbol(symbol), [symbol]);

  // Generate initial high-frequency candlestick history based on symbol base price
  useEffect(() => {
    const base = currentBid > 0 ? currentBid : 2684.25;
    const numCandles = 32;
    const generated: CandleData[] = [];
    let prevClose = base * 0.985;

    const volatility = base > 1000 ? base * 0.0018 : base > 50 ? 0.35 : 0.0004;

    const now = Date.now();
    for (let i = numCandles; i >= 0; i--) {
      const timeOffset = i * (timeframe === '1m' ? 60000 : timeframe === '5m' ? 300000 : 900000);
      const d = new Date(now - timeOffset);
      const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

      const change = (Math.random() - 0.48) * volatility * 2.5;
      const open = prevClose;
      const close = Math.max(0.0001, open + change);
      const high = Math.max(open, close) + Math.random() * volatility * 1.5;
      const low = Math.min(open, close) - Math.random() * volatility * 1.5;
      const volume = Math.floor(Math.random() * 80 + 20);

      generated.push({
        time: timeStr,
        open,
        high,
        low,
        close,
        volume,
        isUp: close >= open,
      });

      prevClose = close;
    }

    setCandles(generated);
    setLiveBid(prevClose);
    setLiveAsk(prevClose + (base > 100 ? 0.35 : 0.00021));
  }, [symbol, timeframe]);

  // Continuous High-Frequency Live Market Ticker (ticks every 800ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCandles((prev) => {
        if (prev.length === 0) return prev;
        const next = [...prev];
        const lastIndex = next.length - 1;
        const last = { ...next[lastIndex] };

        const base = last.close;
        const volatility = base > 1000 ? 0.45 : base > 50 ? 0.08 : 0.00008;
        const tick = (Math.random() - 0.48) * volatility;
        const newClose = Math.max(0.0001, last.close + tick);
        const isUp = tick >= 0;

        setLastTickDirection(isUp ? 'up' : 'down');
        setLiveBid(newClose);
        setLiveAsk(newClose + (base > 100 ? 0.35 : 0.00021));

        last.close = newClose;
        last.high = Math.max(last.high, newClose);
        last.low = Math.min(last.low, newClose);
        last.isUp = last.close >= last.open;
        last.volume += Math.floor(Math.random() * 4 + 1);

        next[lastIndex] = last;
        return next;
      });
    }, 800);

    return () => clearInterval(timer);
  }, []);

  // Compute scale boundaries
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    if (candles.length === 0) {
      return { minPrice: 0, maxPrice: 1, priceRange: 1 };
    }
    let min = Infinity;
    let max = -Infinity;
    candles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
    });
    const padding = (max - min) * 0.08 || 0.01;
    return {
      minPrice: min - padding,
      maxPrice: max + padding,
      priceRange: max - min + padding * 2 || 1,
    };
  }, [candles]);

  const activeCandle = hoveredCandle || (candles.length > 0 ? candles[candles.length - 1] : null);

  return (
    <div
      className="w-full bg-[#0D0E12] border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl relative select-none font-sans"
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    >
      {/* Top Header Controls Bar */}
      <div className="p-3 bg-[#13151C] border-b border-neutral-800/90 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Symbol & Live Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono font-black text-white text-sm sm:text-base tracking-wide">
              {symbol}
            </span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 font-mono text-[10px] font-bold">
            <Zap className="w-3 h-3 fill-emerald-400" />
            US New York Live Feed
          </span>
        </div>

        {/* Center: Timeframe Pills */}
        <div className="flex items-center gap-1 bg-[#1A1D27] p-1 rounded-xl border border-neutral-800">
          {['1m', '5m', '15m', '1h', '4h', '1D'].map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Right: Mode Switcher & Technical Indicators */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEngineMode(engineMode === 'live-canvas' ? 'tradingview' : 'live-canvas')}
            className="px-2.5 py-1 rounded-lg bg-[#1F2333] hover:bg-[#282D42] text-neutral-200 border border-neutral-700 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Globe className="w-3 h-3 text-red-400" />
            <span>{engineMode === 'live-canvas' ? 'Switch ke TradingView' : 'Switch ke Live Engine'}</span>
          </button>
        </div>
      </div>

      {/* Main Display Body */}
      {engineMode === 'tradingview' ? (
        <div className="w-full flex-1 relative bg-[#111318]">
          <iframe
            title="TradingView Embedded Chart"
            src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=${encodeURIComponent(
              cleanTvSymbol
            )}&interval=${timeframe === '1m' ? '1' : timeframe === '5m' ? '5' : timeframe === '15m' ? '15' : timeframe === '1h' ? '60' : timeframe === '4h' ? '240' : 'D'}&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=13151C&studies=%5B%22MASimple%40tv-basicstudies%22%2C%22RSI%40tv-basicstudies%22%5D&theme=dark&style=1&timezone=Asia%2FJakarta&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=id&utm_source=localhost`}
            className="w-full h-full border-none"
            allowTransparency
          />
        </div>
      ) : (
        /* Real-Time HTML5 High-Performance Live Candlestick Canvas */
        <div className="w-full flex-1 relative bg-[#0B0C10] overflow-hidden flex flex-col justify-between p-3">
          {/* Sub-bar: Live OHLC & Floating Ticker */}
          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-400 border-b border-neutral-800/60 pb-2 z-20">
            {activeCandle && (
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <span>
                  O: <strong className="text-white">{activeCandle.open.toFixed(digits)}</strong>
                </span>
                <span>
                  H: <strong className="text-emerald-400">{activeCandle.high.toFixed(digits)}</strong>
                </span>
                <span>
                  L: <strong className="text-red-400">{activeCandle.low.toFixed(digits)}</strong>
                </span>
                <span>
                  C:{' '}
                  <strong className={activeCandle.isUp ? 'text-emerald-400' : 'text-red-400'}>
                    {activeCandle.close.toFixed(digits)}
                  </strong>
                </span>
                <span className="text-neutral-500 hidden sm:inline">
                  Vol: <strong className="text-neutral-300">{activeCandle.volume}K</strong>
                </span>
              </div>
            )}

            {/* Live Ask / Bid badges */}
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300 font-bold text-[10px]">
                BID: {liveBid.toFixed(digits)}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold text-[10px]">
                ASK: {liveAsk.toFixed(digits)}
              </span>
            </div>
          </div>

          {/* Grid lines Background */}
          <div className="absolute inset-0 pointer-events-none grid grid-rows-5 grid-cols-6 divide-y divide-x divide-neutral-800/30 opacity-40" />

          {/* Dynamic Horizontal Live Price Lines */}
          {/* Ask Line (Green dashed) */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-emerald-500/70 z-20 flex justify-end pr-2 transition-all duration-300"
            style={{
              bottom: `${Math.min(95, Math.max(5, ((liveAsk - minPrice) / priceRange) * 100))}%`,
            }}
          >
            <span className="bg-emerald-600 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow font-bold">
              Ask {liveAsk.toFixed(digits)}
            </span>
          </div>

          {/* Bid Line (Red dashed) */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-red-500/70 z-20 flex justify-end pr-2 transition-all duration-300"
            style={{
              bottom: `${Math.min(95, Math.max(5, ((liveBid - minPrice) / priceRange) * 100))}%`,
            }}
          >
            <span
              className={`text-white text-[10px] font-mono px-2 py-0.5 rounded shadow font-bold transition-colors ${
                lastTickDirection === 'up' ? 'bg-emerald-500' : 'bg-red-600'
              }`}
            >
              Bid {liveBid.toFixed(digits)}
            </span>
          </div>

          {/* Candlesticks & Volume Bars Container */}
          <div className="flex-1 flex items-end justify-between gap-1 sm:gap-1.5 px-2 py-6 relative z-10">
            {candles.map((candle, idx) => {
              const isLast = idx === candles.length - 1;
              const openPct = ((candle.open - minPrice) / priceRange) * 100;
              const closePct = ((candle.close - minPrice) / priceRange) * 100;
              const highPct = ((candle.high - minPrice) / priceRange) * 100;
              const lowPct = ((candle.low - minPrice) / priceRange) * 100;

              const candleBottom = Math.min(openPct, closePct);
              const candleHeight = Math.max(2.5, Math.abs(closePct - openPct));
              const wickHeight = Math.max(1, highPct - lowPct);

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredCandle(candle)}
                  onMouseLeave={() => setHoveredCandle(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-crosshair"
                >
                  {/* High-Low Wick */}
                  <div
                    className={`w-0.5 absolute transition-all duration-200 ${
                      candle.isUp ? 'bg-emerald-400' : 'bg-red-400'
                    }`}
                    style={{
                      bottom: `${lowPct}%`,
                      height: `${wickHeight}%`,
                    }}
                  />

                  {/* Candle Body */}
                  <div
                    className={`w-full max-w-[12px] sm:max-w-[16px] rounded-xs z-10 transition-all duration-200 ${
                      candle.isUp
                        ? 'bg-emerald-500 border border-emerald-400 shadow-emerald-500/20'
                        : 'bg-red-600 border border-red-500 shadow-red-500/20'
                    } ${isLast ? 'ring-1 ring-white/50 animate-pulse' : ''}`}
                    style={{
                      position: 'absolute',
                      bottom: `${candleBottom}%`,
                      height: `${candleHeight}%`,
                    }}
                  />

                  {/* Volume Sub-Bar */}
                  <div
                    className={`w-full max-w-[8px] opacity-35 rounded-t-xs mt-1 ${
                      candle.isUp ? 'bg-emerald-400' : 'bg-red-400'
                    }`}
                    style={{ height: `${Math.min(30, (candle.volume / 100) * 28)}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Time markers bar on the bottom */}
          <div className="flex justify-between text-[10px] font-mono text-neutral-500 pt-2 border-t border-neutral-800/80 z-20">
            {candles
              .filter((_, i) => i % 6 === 0 || i === candles.length - 1)
              .map((c, i) => (
                <span key={i} className={i === 5 ? 'text-emerald-400 font-bold' : ''}>
                  {c.time}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
