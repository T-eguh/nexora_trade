import React, { useEffect, useRef, memo } from 'react';

interface TradingViewChartProps {
  symbol: string;
  theme?: 'dark' | 'light';
  autosize?: boolean;
  interval?: string;
  height?: number | string;
}

const mapSymbolToTradingView = (symbol: string): string => {
  const clean = symbol.toUpperCase().replace('/', '');
  if (clean === 'EURUSD') return 'FX:EURUSD';
  if (clean === 'GBPUSD') return 'FX:GBPUSD';
  if (clean === 'USDJPY') return 'FX:USDJPY';
  if (clean === 'AUDUSD') return 'FX:AUDUSD';
  if (clean === 'USDCAD') return 'FX:USDCAD';
  if (clean === 'USDCHF') return 'FX:USDCHF';
  if (clean === 'NZDUSD') return 'FX:NZDUSD';
  if (clean === 'EURGBP') return 'FX:EURGBP';
  if (clean === 'EURJPY') return 'FX:EURJPY';
  if (clean === 'GBPJPY') return 'FX:GBPJPY';
  if (clean === 'XAUUSD' || clean === 'GOLD') return 'OANDA:XAUUSD';
  if (clean === 'XAGUSD' || clean === 'SILVER') return 'OANDA:XAGUSD';
  if (clean === 'USOIL' || clean === 'WTI' || clean === 'CL') return 'TVC:USOIL';
  if (clean === 'UKOIL' || clean === 'BRENT') return 'TVC:UKOIL';
  if (clean === 'BTCUSD' || clean === 'BTCUSDT') return 'BINANCE:BTCUSDT';
  if (clean === 'ETHUSD' || clean === 'ETHUSDT') return 'BINANCE:ETHUSDT';
  if (clean === 'US500' || clean === 'SPX500') return 'FOREXCOM:SPXUSD';
  if (clean === 'US30' || clean === 'DJ30') return 'FOREXCOM:DJI';
  if (clean === 'USTEC' || clean === 'NAS100') return 'FOREXCOM:NSXUSD';
  if (clean === 'GER40' || clean === 'DAX40') return 'FOREXCOM:GER40';

  return `FX:${clean}`;
};

export const TradingViewChart: React.FC<TradingViewChartProps> = memo(({
  symbol,
  theme = 'dark',
  autosize = true,
  interval = '15',
  height = 500,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerId = useRef(`tradingview_widget_${Math.random().toString(36).substring(2, 9)}`);

  const tvSymbol = mapSymbolToTradingView(symbol);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    // Clear previous widget
    currentContainer.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.id = containerId.current;
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';
    currentContainer.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      if (typeof (window as any).TradingView !== 'undefined') {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: interval,
          timezone: 'Asia/Jakarta',
          theme: theme,
          style: '1',
          locale: 'id',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerId.current,
          hide_side_toolbar: false,
          withdateranges: true,
          details: true,
          hotlist: false,
          calendar: false,
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
          toolbar_bg: '#111318',
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies',
            'Volume@tv-basicstudies',
          ],
        });
      }
    };

    currentContainer.appendChild(script);

    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
    };
  }, [tvSymbol, theme, interval]);

  return (
    <div className="w-full relative rounded-xl overflow-hidden border border-neutral-800 bg-[#111318]" style={{ height: typeof height === 'number' ? `${height}px` : height }}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
});
