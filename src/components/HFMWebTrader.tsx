import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Star,
  Settings,
  TrendingUp,
  TrendingDown,
  Clock,
  Sliders,
  ChevronDown,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Bell,
  BarChart3,
  Layers,
  ArrowDownUp,
  RefreshCw,
} from 'lucide-react';
import { useMarkets, usePositions, useAccounts, useAuth } from '../hooks/useStorage';
import { StorageService } from '../utils/storage';
import { Market, Position, PriceAlert } from '../types';
import { TradingViewChart } from './TradingViewChart';

export const HFMWebTrader: React.FC = () => {
  const { markets } = useMarkets();
  const { positions } = usePositions();
  const { accounts } = useAccounts();
  const { user } = useAuth();

  const primaryAccount = accounts.find((a) => a.userId === user?.id) || accounts[0];

  // Main navigation tab - default to 'chart' so it opens instantly on page load
  const [activeMainTab, setActiveMainTab] = useState<'instruments' | 'chart' | 'trading' | 'alerts'>('chart');
  const [selectedCategory, setSelectedCategory] = useState<string>('Favorit');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMarket, setSelectedMarket] = useState<Market>(markets[0] || {} as Market);

  // Chart state
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | 'D'>('5m');
  const [lotSize, setLotSize] = useState<string>('0.10');
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');

  // Trade feedback
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Settings modal
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [showInChartOpenPos, setShowInChartOpenPos] = useState(true);
  const [showInChartSLTP, setShowInChartSLTP] = useState(true);
  const [showInChartPending, setShowInChartPending] = useState(true);
  const [showInInstChart, setShowInInstChart] = useState(true);
  const [showInInstBid, setShowInInstBid] = useState(true);
  const [showInInstAsk, setShowInInstAsk] = useState(true);
  const [showInInstFav, setShowInInstFav] = useState(true);

  // Trading positions sub-tab
  const [tradingSubTab, setTradingSubTab] = useState<'open' | 'pending'>('open');

  // Alerts
  const [alerts, setAlerts] = useState<PriceAlert[]>(StorageService.getPriceAlerts());
  const [newAlertModalOpen, setNewAlertModalOpen] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState('');
  const [alertCondition, setAlertCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');

  // Set default selected market once markets are loaded
  useEffect(() => {
    if (markets.length > 0 && (!selectedMarket || !selectedMarket.id)) {
      const gold = markets.find((m) => m.symbol.includes('XAU')) || markets[0];
      setSelectedMarket(gold);
    }
  }, [markets]);

  // Live price tick simulation
  const [livePrices, setLivePrices] = useState<Record<string, { bid: number; ask: number; change: number; isUp?: boolean }>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrices((prev) => {
        const next = { ...prev };
        markets.forEach((m) => {
          const delta = (Math.random() - 0.49) * (m.category === 'Crypto' ? 4.5 : m.category === 'Komoditas' ? 0.35 : 0.00015);
          const currentBid = (next[m.id]?.bid || m.bid) + delta;
          const currentAsk = currentBid + (m.spread * (m.digits === 5 ? 0.0001 : m.digits === 3 ? 0.01 : 0.1));
          next[m.id] = {
            bid: Math.max(0.00001, currentBid),
            ask: Math.max(0.00002, currentAsk),
            change: m.changePercent + (delta > 0 ? 0.01 : -0.01),
            isUp: delta >= 0,
          };
        });
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [markets]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleExecuteTrade = (type: 'BUY' | 'SELL') => {
    const currentPriceData = livePrices[selectedMarket.id] || {
      bid: selectedMarket.bid,
      ask: selectedMarket.ask,
    };
    const execPrice = type === 'BUY' ? currentPriceData.ask : currentPriceData.bid;
    const vol = parseFloat(lotSize) || 0.1;

    if (vol <= 0) {
      showToast('Volume lot harus lebih besar dari 0.01', 'error');
      return;
    }

    const newPos: Omit<Position, 'id' | 'openTime'> = {
      accountId: primaryAccount?.accountNumber || '205128182',
      symbol: selectedMarket.symbol,
      type,
      volume: vol,
      openPrice: execPrice,
      currentPrice: execPrice,
      pnl: 0,
      status: 'open',
    };

    StorageService.addPosition(newPos);
    showToast(`Order ${type} ${vol} lot ${selectedMarket.symbol} berhasil dieksekusi pada harga ${execPrice.toFixed(selectedMarket.digits)}!`);
  };

  const handleClosePosition = (posId: string) => {
    StorageService.closePosition(posId);
    showToast('Posisi trading berhasil ditutup!');
  };

  const handleToggleFavorite = (marketId: string) => {
    StorageService.toggleFavorite(marketId);
  };

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(alertTargetPrice);
    if (!price || price <= 0) {
      showToast('Masukkan target harga peringatan yang valid', 'error');
      return;
    }

    StorageService.addPriceAlert({
      symbol: selectedMarket.symbol,
      targetPrice: price,
      condition: alertCondition,
    });

    setAlerts(StorageService.getPriceAlerts());
    setNewAlertModalOpen(false);
    setAlertTargetPrice('');
    showToast(`Peringatan harga untuk ${selectedMarket.symbol} aktif!`);
  };

  const handleDeleteAlert = (id: string) => {
    StorageService.deletePriceAlert(id);
    setAlerts(StorageService.getPriceAlerts());
    showToast('Peringatan harga dihapus.');
  };

  // Filter markets
  const filteredMarkets = markets.filter((m) => {
    const matchesSearch =
      m.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'Favorit') {
      return m.isFavorite;
    }
    if (selectedCategory === 'Forex') {
      return m.category === 'Forex';
    }
    if (selectedCategory === 'Crypto') {
      return m.category === 'Crypto';
    }
    if (selectedCategory === 'Komoditas') {
      return m.category === 'Komoditas' || m.category === 'Metals' || m.category === 'Commodities';
    }
    if (selectedCategory === 'Indeks') {
      return m.category === 'Indeks' || m.category === 'Indices';
    }
    if (selectedCategory === 'Saham') {
      return m.category === 'Saham';
    }
    return true;
  });

  const openPositions = positions.filter((p) => p.status === 'open');
  const closedPositions = positions.filter((p) => p.status === 'closed');
  const totalOpenPnl = openPositions.reduce((acc, p) => acc + p.pnl, 0);

  const selectedLive = livePrices[selectedMarket.id] || {
    bid: selectedMarket.bid || 1.1582,
    ask: selectedMarket.ask || 1.1584,
    change: selectedMarket.changePercent || 0.1,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden font-sans text-neutral-800 flex flex-col">
      {/* Toast notification */}
      {toastMsg && (
        <div
          className={`fixed top-20 right-4 z-50 p-3.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-bold text-white transition-all animate-slideDown ${
            toastMsg.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toastMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Top Main Navigation Tabs matching Video 2 & 3 */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-2 sm:px-4">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveMainTab('instruments')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeMainTab === 'instruments'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Instrumen
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('chart')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeMainTab === 'chart'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Chart ({selectedMarket.symbol || 'XAUUSDc'})
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('trading')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold transition-colors cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeMainTab === 'trading'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>Trading</span>
            {openPositions.length > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {openPositions.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('alerts')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold transition-colors cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeMainTab === 'alerts'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>Peringatan</span>
            {alerts.length > 0 && (
              <span className="bg-neutral-800 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {alerts.length}
              </span>
            )}
          </button>
        </div>

        {/* Settings gear icon */}
        <button
          type="button"
          onClick={() => setSettingsModalOpen(true)}
          className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          title="Pengaturan Tampilan"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* TAB 1: INSTRUMEN (Market Watch List) */}
      {activeMainTab === 'instruments' && (
        <div className="p-3 sm:p-4 space-y-3">
          {/* Search bar matching video */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Pasar"
              className="w-full pl-9 pr-4 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-600 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
            />
          </div>

          {/* Category Filter Pills matching Video 2 & 3 */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {['Favorit', 'Forex', 'Crypto', 'Komoditas', 'Indeks', 'Saham'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1a1c23] text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Instrument Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-[11px] text-neutral-500 border-b border-neutral-200 font-semibold">
                  <th className="py-2 px-3">Simbol</th>
                  {showInInstBid && <th className="py-2 px-2 text-center">Tawar</th>}
                  {showInInstAsk && <th className="py-2 px-2 text-center">Minta</th>}
                  {showInInstChart && <th className="py-2 px-2 text-center hidden sm:table-cell">Chart</th>}
                  {showInInstFav && <th className="py-2 px-2 text-right">Favorit</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredMarkets.map((market) => {
                  const live = livePrices[market.id] || {
                    bid: market.bid,
                    ask: market.ask,
                    change: market.changePercent,
                  };
                  const isSelected = selectedMarket.id === market.id;

                  return (
                    <tr
                      key={market.id}
                      onClick={() => setSelectedMarket(market)}
                      className={`hover:bg-neutral-50 transition-colors cursor-pointer ${
                        isSelected ? 'bg-red-50/40' : ''
                      }`}
                    >
                      {/* Symbol & Change % */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMarket(market);
                              setActiveMainTab('chart');
                            }}
                            className="text-left font-bold text-neutral-900 hover:text-red-600 font-mono flex flex-col"
                          >
                            <span className="text-xs">{market.symbol}</span>
                            <span
                              className={`text-[10px] font-sans ${
                                live.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                              }`}
                            >
                              {live.change >= 0 ? '+' : ''}
                              {live.change.toFixed(2)}%
                            </span>
                          </button>
                        </div>
                      </td>

                      {/* Tawar (Bid / Jual) Red outlined button */}
                      {showInInstBid && (
                        <td className="py-3 px-2 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMarket(market);
                              handleExecuteTrade('SELL');
                            }}
                            className="w-full max-w-[100px] mx-auto py-1.5 px-2 rounded border border-red-500 bg-red-50/50 hover:bg-red-600 hover:text-white text-red-600 font-mono font-bold text-xs transition-colors flex flex-col items-center leading-tight cursor-pointer"
                          >
                            <span className="text-[9px] uppercase font-sans font-normal opacity-80">Jual</span>
                            <span>{live.bid.toFixed(market.digits)}</span>
                          </button>
                        </td>
                      )}

                      {/* Minta (Ask / Beli) Green outlined button */}
                      {showInInstAsk && (
                        <td className="py-3 px-2 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMarket(market);
                              handleExecuteTrade('BUY');
                            }}
                            className="w-full max-w-[100px] mx-auto py-1.5 px-2 rounded border border-emerald-600 bg-emerald-50/50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-mono font-bold text-xs transition-colors flex flex-col items-center leading-tight cursor-pointer"
                          >
                            <span className="text-[9px] uppercase font-sans font-normal opacity-80">Beli</span>
                            <span>{live.ask.toFixed(market.digits)}</span>
                          </button>
                        </td>
                      )}

                      {/* Mini sparkline */}
                      {showInInstChart && (
                        <td className="py-3 px-2 text-center hidden sm:table-cell">
                          <div className="w-16 h-5 mx-auto flex items-end gap-0.5">
                            {market.sparkline.map((val, idx) => {
                              const min = Math.min(...market.sparkline);
                              const max = Math.max(...market.sparkline);
                              const heightPct = Math.max(15, ((val - min) / (max - min || 1)) * 100);
                              return (
                                <div
                                  key={idx}
                                  className={`flex-1 rounded-t-sm ${
                                    live.change >= 0 ? 'bg-emerald-500' : 'bg-red-500'
                                  }`}
                                  style={{ height: `${heightPct}%` }}
                                />
                              );
                            })}
                          </div>
                        </td>
                      )}

                      {/* Star favorite toggle */}
                      {showInInstFav && (
                        <td className="py-3 px-2 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(market.id);
                            }}
                            className="p-1 text-neutral-400 hover:text-amber-500 transition-colors"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                market.isFavorite
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-neutral-300'
                              }`}
                            />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE CHART VIEW */}
      {activeMainTab === 'chart' && (
        <div className="p-3 sm:p-4 space-y-4">
          {/* Symbol Header & Specs */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-50 p-3 rounded-xl border border-neutral-200">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black font-mono text-neutral-900">
                    {selectedMarket.symbol}
                  </span>
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                      selectedLive.change >= 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedLive.change >= 0 ? '+' : ''}
                    {selectedLive.change.toFixed(2)}%
                  </span>
                  <span className="text-[10px] font-mono bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded">
                    Server: US New York (Amerikan) Live
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500">{selectedMarket.name}</span>
              </div>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center gap-1 bg-white border border-neutral-300 p-0.5 rounded-lg text-xs font-bold">
              {(['1m', '5m', '15m', '1h', '4h', '1D'] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf as any)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    timeframe === tf ? 'bg-[#1a1c23] text-white' : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* TradingView Real-Time Candlestick Chart */}
          <TradingViewChart
            symbol={selectedMarket.symbol}
            theme="dark"
            interval={timeframe === '1m' ? '1' : timeframe === '5m' ? '5' : timeframe === '15m' ? '15' : timeframe === '1h' ? '60' : timeframe === '4h' ? '240' : 'D'}
            height={480}
            currentBid={selectedLive.bid}
            currentAsk={selectedLive.ask}
            digits={selectedMarket.digits}
          />

          {/* Quick Buy/Sell Buttons & Lot size control */}
          <div className="space-y-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="text-xs font-bold text-neutral-700">Volume Lot (Ukuran Kontrak):</label>
              <div className="flex items-center gap-1.5">
                {['0.01', '0.05', '0.10', '0.50', '1.00', '2.00'].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLotSize(l)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors ${
                      lotSize === l
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Large RED SELL button */}
              <button
                type="button"
                onClick={() => handleExecuteTrade('SELL')}
                className="py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-md flex flex-col items-center justify-center cursor-pointer active:scale-98"
              >
                <span className="text-[11px] uppercase tracking-wider font-medium opacity-90">
                  Jual (Sell)
                </span>
                <span className="text-base sm:text-lg font-mono">
                  {selectedLive.bid.toFixed(selectedMarket.digits)}
                </span>
              </button>

              {/* Large GREEN BUY button */}
              <button
                type="button"
                onClick={() => handleExecuteTrade('BUY')}
                className="py-3.5 px-4 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold transition-all shadow-md flex flex-col items-center justify-center cursor-pointer active:scale-98"
              >
                <span className="text-[11px] uppercase tracking-wider font-medium opacity-90">
                  Beli (Buy)
                </span>
                <span className="text-base sm:text-lg font-mono">
                  {selectedLive.ask.toFixed(selectedMarket.digits)}
                </span>
              </button>
            </div>
          </div>

          {/* Market Specs Accordion */}
          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 text-xs space-y-2">
            <h5 className="font-bold text-neutral-900">Spesifikasi Instrumen {selectedMarket.symbol}</h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-neutral-600 pt-1">
              <div>• Jam Trading: <strong>24/5 Live</strong></div>
              <div>• Ukuran Pip: <strong>{selectedMarket.pipValue}</strong></div>
              <div>• Spread Tipikal: <strong>{selectedMarket.spread} pips</strong></div>
              <div>• Server: <strong>US New York (Amerikan)</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRADING (Positions: Buka, Tertunda) */}
      {activeMainTab === 'trading' && (
        <div className="p-3 sm:p-4 space-y-4">
          {/* Sub-tabs: Buka / Tertunda */}
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setTradingSubTab('open')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  tradingSubTab === 'open'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Posisi Terbuka ({openPositions.length})
              </button>

              <button
                type="button"
                onClick={() => setTradingSubTab('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  tradingSubTab === 'pending'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Order Tertunda (0)
              </button>
            </div>

            {/* Total Floating PnL Pill */}
            <div className="text-xs">
              <span className="text-neutral-500 mr-1">Total P/L:</span>
              <strong
                className={`font-mono ${
                  totalOpenPnl >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {totalOpenPnl >= 0 ? '+' : ''}${totalOpenPnl.toFixed(2)}
              </strong>
            </div>
          </div>

          {/* Open Positions List */}
          {tradingSubTab === 'open' && (
            <div className="space-y-2">
              {openPositions.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-500">
                  Tidak ada posisi trading yang sedang dibuka saat ini.
                </div>
              ) : (
                openPositions.map((pos) => (
                  <div
                    key={pos.id}
                    className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 font-mono text-sm">
                          {pos.symbol}
                        </span>
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                            pos.type === 'BUY'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {pos.type} {pos.volume.toFixed(2)} Lot
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                        Buka: {pos.openPrice.toFixed(4)} → Sekarang: {pos.currentPrice.toFixed(4)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-500 block">P/L Berjalan</span>
                        <span
                          className={`font-bold font-mono text-sm ${
                            pos.pnl >= 0 ? 'text-emerald-600' : 'text-red-600'
                          }`}
                        >
                          {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleClosePosition(pos.id)}
                        className="py-1.5 px-3 bg-neutral-200 hover:bg-red-600 hover:text-white rounded-lg text-neutral-800 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Pending Orders */}
          {tradingSubTab === 'pending' && (
            <div className="py-12 text-center text-xs text-neutral-500">
              Tidak ada order tertunda (Pending Limit / Stop).
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PERINGATAN HARGA matching Video 3 */}
      {activeMainTab === 'alerts' && (
        <div className="p-3 sm:p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                Peringatan Harga ({alerts.length})
              </h4>
              <p className="text-xs text-neutral-500">
                Dapatkan notifikasi instan saat harga mencapai target yang Anda tetapkan.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNewAlertModalOpen(true)}
              className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Peringatan</span>
            </button>
          </div>

          <div className="space-y-2">
            {alerts.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-500">
                Belum ada peringatan harga yang aktif. Klik 'Tambah Peringatan' untuk membuat baru.
              </div>
            ) : (
              alerts.map((al) => (
                <div
                  key={al.id}
                  className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4 text-emerald-600" />
                    <div>
                      <strong className="text-neutral-900 font-mono">{al.symbol}</strong>
                      <span className="text-[11px] text-neutral-500 block">
                        Saat harga {al.condition === 'ABOVE' ? 'naik di atas' : 'turun di bawah'}{' '}
                        <strong>{al.targetPrice}</strong>
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteAlert(al.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Settings Modal matching Video 3 */}
      {settingsModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-base font-bold text-neutral-900">Pengaturan</h3>
              <button
                type="button"
                onClick={() => setSettingsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Tampilkan dalam Chart */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                Tampilkan dalam Chart
              </span>

              <div className="flex items-center justify-between text-xs text-neutral-800 py-1">
                <span>Posisi Dibuka</span>
                <input
                  type="checkbox"
                  checked={showInChartOpenPos}
                  onChange={(e) => setShowInChartOpenPos(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-800 py-1">
                <span>SL / TP</span>
                <input
                  type="checkbox"
                  checked={showInChartSLTP}
                  onChange={(e) => setShowInChartSLTP(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-800 py-1">
                <span>Tertunda</span>
                <input
                  type="checkbox"
                  checked={showInChartPending}
                  onChange={(e) => setShowInChartPending(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </div>
            </div>

            {/* Section 2: Tampilkan dalam Instrumen */}
            <div className="space-y-3 pt-3 border-t border-neutral-200">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                Tampilkan dalam Instrumen
              </span>

              <div className="flex items-center justify-between text-xs text-neutral-800 py-1">
                <span>Chart</span>
                <input
                  type="checkbox"
                  checked={showInInstChart}
                  onChange={(e) => setShowInInstChart(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-800 py-1">
                <span>Tawar (Bid)</span>
                <input
                  type="checkbox"
                  checked={showInInstBid}
                  onChange={(e) => setShowInInstBid(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-800 py-1">
                <span>Minta (Ask)</span>
                <input
                  type="checkbox"
                  checked={showInInstAsk}
                  onChange={(e) => setShowInInstAsk(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-800 py-1">
                <span>Favorit</span>
                <input
                  type="checkbox"
                  checked={showInInstFav}
                  onChange={(e) => setShowInInstFav(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSettingsModalOpen(false)}
              className="w-full py-2.5 bg-[#1a1c23] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Simpan Pengaturan
            </button>
          </div>
        </div>
      )}

      {/* New Alert Modal */}
      {newAlertModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">
                Buat Peringatan — {selectedMarket.symbol}
              </h3>
              <button
                type="button"
                onClick={() => setNewAlertModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAlert} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Kondisi</label>
                <select
                  value={alertCondition}
                  onChange={(e) => setAlertCondition(e.target.value as any)}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs font-medium"
                >
                  <option value="ABOVE">Harga Lebih Tinggi Dari (&gt;=)</option>
                  <option value="BELOW">Harga Lebih Rendah Dari (&lt;=)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Target Harga</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={alertTargetPrice}
                  onChange={(e) => setAlertTargetPrice(e.target.value)}
                  placeholder={`Harga saat ini: ${selectedLive.ask.toFixed(selectedMarket.digits)}`}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow"
              >
                Aktifkan Peringatan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
