import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Badge } from '../../components/Badge';
import { Tabs } from '../../components/Tabs';
import {
  Calculator,
  Calendar,
  DollarSign,
  TrendingUp,
  Percent,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { INITIAL_ECONOMIC_EVENTS } from '../../data/site';
import { Table, Column } from '../../components/Table';
import { EconomicEvent } from '../../types';

export const ToolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profit');

  // --- 1. PROFIT CALCULATOR STATE ---
  const [profitInstrument, setProfitInstrument] = useState('EURUSD');
  const [profitType, setProfitType] = useState<'BUY' | 'SELL'>('BUY');
  const [profitVolume, setProfitVolume] = useState('1.00');
  const [profitOpenPrice, setProfitOpenPrice] = useState('1.08000');
  const [profitClosePrice, setProfitClosePrice] = useState('1.08650');
  const [profitResult, setProfitResult] = useState<{
    pnl: number;
    pips: number;
    currency: string;
  } | null>(null);

  const calculateProfit = (e: React.FormEvent) => {
    e.preventDefault();
    const lots = parseFloat(profitVolume) || 1;
    const open = parseFloat(profitOpenPrice) || 1;
    const close = parseFloat(profitClosePrice) || 1;

    let contractSize = 100000;
    let pipDivider = 0.0001;

    if (profitInstrument === 'USDJPY') {
      pipDivider = 0.01;
    } else if (profitInstrument === 'XAUUSD') {
      contractSize = 100;
      pipDivider = 0.1;
    } else if (profitInstrument === 'BTCUSD') {
      contractSize = 1;
      pipDivider = 1;
    }

    const priceDiff = profitType === 'BUY' ? close - open : open - close;
    const pnl = priceDiff * contractSize * lots;
    const pips = (close - open) / pipDivider;

    setProfitResult({
      pnl: parseFloat(pnl.toFixed(2)),
      pips: parseFloat((profitType === 'BUY' ? pips : -pips).toFixed(1)),
      currency: 'USD',
    });
  };

  // --- 2. PIP CALCULATOR STATE ---
  const [pipInstrument, setPipInstrument] = useState('EURUSD');
  const [pipVolume, setPipVolume] = useState('1.00');
  const [pipResult, setPipResult] = useState<number | null>(null);

  const calculatePip = (e: React.FormEvent) => {
    e.preventDefault();
    const lots = parseFloat(pipVolume) || 1;
    let valPerLot = 10; // Default EURUSD 1 lot = $10/pip

    if (pipInstrument === 'USDJPY') {
      valPerLot = 9.1;
    } else if (pipInstrument === 'XAUUSD') {
      valPerLot = 10; // $10 per 0.10 gold move on 100 oz
    } else if (pipInstrument === 'BTCUSD') {
      valPerLot = 1;
    }

    setPipResult(parseFloat((valPerLot * lots).toFixed(2)));
  };

  // --- 3. MARGIN CALCULATOR STATE ---
  const [marginInstrument, setMarginInstrument] = useState('EURUSD');
  const [marginLeverage, setMarginLeverage] = useState('500');
  const [marginVolume, setMarginVolume] = useState('1.00');
  const [marginPrice, setMarginPrice] = useState('1.0850');
  const [marginResult, setMarginResult] = useState<number | null>(null);

  const calculateMargin = (e: React.FormEvent) => {
    e.preventDefault();
    const lots = parseFloat(marginVolume) || 1;
    const lev = parseFloat(marginLeverage) || 500;
    const price = parseFloat(marginPrice) || 1;

    let contractSize = 100000;
    if (marginInstrument === 'XAUUSD') contractSize = 100;
    if (marginInstrument === 'BTCUSD') contractSize = 1;

    const notional = lots * contractSize * price;
    const required = notional / lev;

    setMarginResult(parseFloat(required.toFixed(2)));
  };

  // --- 4. ECONOMIC CALENDAR ---
  const [ecoFilter, setEcoFilter] = useState<'ALL' | 'high' | 'medium' | 'low'>('ALL');
  const filteredEvents = INITIAL_ECONOMIC_EVENTS.filter(
    (ev) => ecoFilter === 'ALL' || ev.impact === ecoFilter
  );

  const ecoColumns: Column<EconomicEvent>[] = [
    {
      header: 'Time',
      render: (ev) => <span className="font-semibold text-neutral-300">{ev.time}</span>,
    },
    {
      header: 'Cur',
      render: (ev) => (
        <span className="px-2 py-0.5 bg-[#151518] rounded text-white font-bold border border-neutral-800">
          {ev.currency}
        </span>
      ),
    },
    {
      header: 'Impact',
      render: (ev) => {
        const variant = ev.impact === 'high' ? 'danger' : ev.impact === 'medium' ? 'warning' : 'neutral';
        return (
          <Badge variant={variant} size="sm">
            {ev.impact.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      header: 'Event',
      render: (ev) => <span className="font-medium text-white">{ev.event}</span>,
    },
    {
      header: 'Actual',
      align: 'right',
      render: (ev) => <span className="text-emerald-400 font-bold">{ev.actual || '-'}</span>,
    },
    {
      header: 'Forecast',
      align: 'right',
      render: (ev) => <span className="text-neutral-400">{ev.forecast || '-'}</span>,
    },
    {
      header: 'Previous',
      align: 'right',
      render: (ev) => <span className="text-neutral-400">{ev.previous || '-'}</span>,
    },
  ];

  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="red" size="md">
          TRADING TOOLBOX
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Precision Financial Calculators
        </h1>
        <p className="text-sm sm:text-base text-neutral-300">
          Calculate risk parameters, required margin buffers, pip values, and evaluate high-impact macroeconomic events before deploying capital.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <Tabs
          tabs={[
            { id: 'profit', label: 'Profit Calculator', icon: <DollarSign className="w-4 h-4" /> },
            { id: 'pip', label: 'Pip Calculator', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'margin', label: 'Margin Calculator', icon: <Percent className="w-4 h-4" /> },
            { id: 'calendar', label: 'Economic Calendar', icon: <Calendar className="w-4 h-4" /> },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* 1. PROFIT CALCULATOR */}
      {activeTab === 'profit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <Card padding="lg" className="lg:col-span-7">
            <h3 className="text-lg font-bold text-white mb-1">Position Profit & Loss Calculator</h3>
            <p className="text-xs text-neutral-400 mb-6">
              Estimate potential returns and pip gains based on custom entry and exit parameters.
            </p>

            <form onSubmit={calculateProfit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Instrument"
                  value={profitInstrument}
                  onChange={(e) => setProfitInstrument(e.target.value)}
                  options={[
                    { value: 'EURUSD', label: 'EUR/USD (Euro / US Dollar)' },
                    { value: 'GBPUSD', label: 'GBP/USD (British Pound)' },
                    { value: 'USDJPY', label: 'USD/JPY (US Dollar / Yen)' },
                    { value: 'XAUUSD', label: 'XAU/USD (Spot Gold)' },
                    { value: 'BTCUSD', label: 'BTC/USD (Bitcoin)' },
                  ]}
                />

                <Select
                  label="Direction"
                  value={profitType}
                  onChange={(e) => setProfitType(e.target.value as 'BUY' | 'SELL')}
                  options={[
                    { value: 'BUY', label: 'Buy (Long)' },
                    { value: 'SELL', label: 'Sell (Short)' },
                  ]}
                />
              </div>

              <Input
                label="Trade Volume (Lots)"
                type="number"
                step="0.01"
                min="0.01"
                value={profitVolume}
                onChange={(e) => setProfitVolume(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Open Price"
                  type="number"
                  step="any"
                  value={profitOpenPrice}
                  onChange={(e) => setProfitOpenPrice(e.target.value)}
                  required
                />
                <Input
                  label="Close Price"
                  type="number"
                  step="any"
                  value={profitClosePrice}
                  onChange={(e) => setProfitClosePrice(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" fullWidth size="md">
                Calculate Projected Profit
              </Button>
            </form>
          </Card>

          {/* Results Summary Box */}
          <Card padding="lg" className="lg:col-span-5 bg-[#151518] border-neutral-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
              Calculation Output
            </h4>

            {profitResult ? (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-[#0D0D0F] border border-neutral-800 text-center font-mono-num">
                  <span className="text-xs text-neutral-400 block mb-1">Net Projected Outcome</span>
                  <span
                    className={`text-3xl font-black ${
                      profitResult.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {profitResult.pnl >= 0 ? '+' : ''}${profitResult.pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="block text-xs text-neutral-400 mt-1">
                    {profitResult.pips >= 0 ? '+' : ''}{profitResult.pips} Pips
                  </span>
                </div>

                <div className="space-y-2.5 text-xs font-mono-num">
                  <div className="flex justify-between py-2 border-b border-neutral-800">
                    <span className="text-neutral-400">Position Type:</span>
                    <span className="font-bold text-white">{profitType}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-800">
                    <span className="text-neutral-400">Volume:</span>
                    <span className="font-bold text-white">{profitVolume} Lot(s)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-800">
                    <span className="text-neutral-400">Price Movement:</span>
                    <span className="font-bold text-white">
                      {profitOpenPrice} → {profitClosePrice}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-500 text-xs">
                Fill the inputs and click "Calculate Projected Profit" to evaluate simulated returns.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* 2. PIP CALCULATOR */}
      {activeTab === 'pip' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <Card padding="lg" className="lg:col-span-7">
            <h3 className="text-lg font-bold text-white mb-1">Pip Value Calculator</h3>
            <p className="text-xs text-neutral-400 mb-6">
              Determine the exact monetary value of a 1-pip movement for any contract size.
            </p>

            <form onSubmit={calculatePip} className="space-y-4">
              <Select
                label="Instrument"
                value={pipInstrument}
                onChange={(e) => setPipInstrument(e.target.value)}
                options={[
                  { value: 'EURUSD', label: 'EUR/USD (Euro / US Dollar)' },
                  { value: 'USDJPY', label: 'USD/JPY (US Dollar / Yen)' },
                  { value: 'XAUUSD', label: 'XAU/USD (Spot Gold)' },
                  { value: 'BTCUSD', label: 'BTC/USD (Bitcoin)' },
                ]}
              />

              <Input
                label="Volume (Lots)"
                type="number"
                step="0.01"
                min="0.01"
                value={pipVolume}
                onChange={(e) => setPipVolume(e.target.value)}
                required
              />

              <Button type="submit" fullWidth size="md">
                Calculate Pip Value
              </Button>
            </form>
          </Card>

          <Card padding="lg" className="lg:col-span-5 bg-[#151518] border-neutral-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
              Pip Value Output
            </h4>

            {pipResult !== null ? (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-[#0D0D0F] border border-neutral-800 text-center font-mono-num">
                  <span className="text-xs text-neutral-400 block mb-1">Value Per 1 Pip</span>
                  <span className="text-3xl font-black text-white">
                    ${pipResult.toFixed(2)} USD
                  </span>
                </div>

                <div className="p-3 bg-[#111114] rounded-lg border border-neutral-800 text-xs text-neutral-300 space-y-1 font-sans">
                  <p className="font-semibold text-white">Risk Formula Insight:</p>
                  <p className="text-neutral-400 text-[11px]">
                    If your Stop Loss is 25 pips away with {pipVolume} lot(s), your total capital at risk is: <strong>${(pipResult * 25).toFixed(2)}</strong>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-500 text-xs">
                Click "Calculate Pip Value" to inspect monetary pip weights.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* 3. MARGIN CALCULATOR */}
      {activeTab === 'margin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <Card padding="lg" className="lg:col-span-7">
            <h3 className="text-lg font-bold text-white mb-1">Required Margin Calculator</h3>
            <p className="text-xs text-neutral-400 mb-6">
              Calculate the required collateral needed to open and maintain leveraged market positions.
            </p>

            <form onSubmit={calculateMargin} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Instrument"
                  value={marginInstrument}
                  onChange={(e) => setMarginInstrument(e.target.value)}
                  options={[
                    { value: 'EURUSD', label: 'EUR/USD' },
                    { value: 'XAUUSD', label: 'XAU/USD (Gold)' },
                    { value: 'BTCUSD', label: 'BTC/USD (Bitcoin)' },
                  ]}
                />

                <Select
                  label="Account Leverage"
                  value={marginLeverage}
                  onChange={(e) => setMarginLeverage(e.target.value)}
                  options={[
                    { value: '100', label: '1:100' },
                    { value: '200', label: '1:200' },
                    { value: '500', label: '1:500 (Standard)' },
                    { value: '1000', label: '1:1000 (Pro)' },
                    { value: '2000', label: '1:2000 (VIP)' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Volume (Lots)"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={marginVolume}
                  onChange={(e) => setMarginVolume(e.target.value)}
                  required
                />

                <Input
                  label="Current Asset Price"
                  type="number"
                  step="any"
                  value={marginPrice}
                  onChange={(e) => setMarginPrice(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" fullWidth size="md">
                Calculate Required Margin
              </Button>
            </form>
          </Card>

          <Card padding="lg" className="lg:col-span-5 bg-[#151518] border-neutral-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
              Margin Requirement
            </h4>

            {marginResult !== null ? (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-[#0D0D0F] border border-neutral-800 text-center font-mono-num">
                  <span className="text-xs text-neutral-400 block mb-1">Required Collateral</span>
                  <span className="text-3xl font-black text-emerald-400">
                    ${marginResult.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="block text-xs text-neutral-400 mt-1">
                    Leverage Ratio: 1:{marginLeverage}
                  </span>
                </div>

                <div className="text-xs text-neutral-400 space-y-2">
                  <p>
                    <strong>Margin Cushion:</strong> Ensure your total account Free Margin exceeds this amount to prevent margin calls during periods of market volatility.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-500 text-xs">
                Enter your order volume and leverage to calculate required margin.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* 4. ECONOMIC CALENDAR */}
      {activeTab === 'calendar' && (
        <Card padding="lg" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Live Macroeconomic Calendar</h3>
              <p className="text-xs text-neutral-400">
                Track scheduled central bank meetings, inflation reports, interest rate decisions, and employment releases.
              </p>
            </div>

            {/* Impact Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">Filter Impact:</span>
              {(['ALL', 'high', 'medium', 'low'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setEcoFilter(lvl)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    ecoFilter === lvl
                      ? 'bg-red-600 text-white'
                      : 'bg-[#151518] text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {lvl.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <Table
            columns={ecoColumns}
            data={filteredEvents}
            keyExtractor={(ev) => ev.id}
            emptyMessage="No economic events match the chosen impact filter."
          />
        </Card>
      )}
    </div>
  );
};
