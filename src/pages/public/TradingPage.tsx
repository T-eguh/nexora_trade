import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { ArrowRight, CheckCircle2, TrendingUp, Shield } from 'lucide-react';
import { useMarkets } from '../../hooks/useStorage';

export const TradingPage: React.FC = () => {
  const { markets } = useMarkets();

  const tradingProducts = [
    {
      id: 'forex',
      title: 'Forex Currency Trading',
      badge: '60+ Pairs',
      description: 'Trade major, minor, and exotic foreign exchange pairs 24 hours a day, 5 days a week with competitive pricing and tight execution.',
      specs: [
        { label: 'Leverage', value: 'Up to 1:1000' },
        { label: 'Spread From', value: '0.0 pips' },
        { label: 'Min Lot', value: '0.01 micro lot' },
        { label: 'Trading Hours', value: '24/5 Global' },
      ],
      features: [
        'Deep institutional liquidity across major currencies (EUR, USD, GBP, JPY, CHF)',
        'Zero requotes with direct STP/ECN market execution',
        'Hedging and automated algorithmic Expert Advisors (EA) fully supported',
        'Transparent swap rates with swap-free Islamic account options',
      ],
      sampleSymbols: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'],
    },
    {
      id: 'gold',
      title: 'Precious Metals & Gold',
      badge: 'Safe-Haven',
      description: 'Capitalize on geopolitical volatility, inflation hedging, and global monetary policy shifts by trading Spot Gold (XAU/USD) and Spot Silver (XAG/USD).',
      specs: [
        { label: 'Leverage', value: 'Up to 1:500' },
        { label: 'Spread From', value: '1.2 pips' },
        { label: 'Min Lot', value: '0.01 lot' },
        { label: 'Trading Hours', value: '23/5' },
      ],
      features: [
        'Trade spot gold without physical storage or custody costs',
        'High liquidity and tight spreads even during high-impact US CPI & NFP releases',
        'Instant execution with advanced stop-loss and take-profit protections',
      ],
      sampleSymbols: ['XAU/USD', 'XAG/USD'],
    },
    {
      id: 'indices',
      title: 'Global Stock Indices',
      badge: '15+ Indices',
      description: 'Gain comprehensive exposure to entire national equity markets in a single trade with benchmark indices from the US, Europe, and Asia.',
      specs: [
        { label: 'Leverage', value: 'Up to 1:200' },
        { label: 'Spread From', value: '0.5 pts' },
        { label: 'Min Lot', value: '0.10 lot' },
        { label: 'Trading Hours', value: 'Market Specific' },
      ],
      features: [
        'Trade the world’s leading tech index (US100 / NASDAQ) and broad market (US500 / S&P 500)',
        'European benchmarks including Germany 40 (DAX) and UK 100',
        'No individual corporate earnings risk—trade broad macroeconomic trends',
      ],
      sampleSymbols: ['US100 (NASDAQ)', 'US500 (S&P 500)', 'GER40 (DAX)'],
    },
    {
      id: 'commodities',
      title: 'Energy & Commodities',
      badge: 'Crude Oil & Gas',
      description: 'Trade physical energy commodities including West Texas Intermediate (WTI) and Brent Crude Oil spot contracts directly from your trading dashboard.',
      specs: [
        { label: 'Leverage', value: 'Up to 1:100' },
        { label: 'Spread From', value: '3.0 pts' },
        { label: 'Min Lot', value: '0.10 lot' },
        { label: 'Trading Hours', value: '23/5' },
      ],
      features: [
        'Direct reflection of global OPEC production and energy consumption cycles',
        'Zero physical delivery obligations—pure cash-settled contracts',
        'Ideal for volatility breakout strategies during inventory report releases',
      ],
      sampleSymbols: ['WTI Oil', 'Brent Oil'],
    },
    {
      id: 'crypto',
      title: 'Cryptocurrency CFDs',
      badge: '24/7 Trading',
      description: 'Trade major digital assets like Bitcoin (BTC/USD), Ethereum (ETH/USD), and Solana (SOL/USD) 24 hours a day, 7 days a week.',
      specs: [
        { label: 'Leverage', value: 'Up to 1:50' },
        { label: 'Spread From', value: 'Competitive' },
        { label: 'Min Lot', value: '0.01 lot' },
        { label: 'Trading Hours', value: '24/7/365' },
      ],
      features: [
        'No need for cold storage crypto wallets or blockchain network transaction gas fees',
        'Go Long (buy) or Short (sell) with rapid sub-second execution',
        'Weekend trading accessibility when traditional markets are closed',
      ],
      sampleSymbols: ['BTC/USD', 'ETH/USD', 'SOL/USD'],
    },
    {
      id: 'cfds',
      title: 'Global Equity CFDs',
      badge: 'Top Equities',
      description: 'Access individual stock contracts for difference on leading technology, financial, and manufacturing enterprises across international exchanges.',
      specs: [
        { label: 'Leverage', value: 'Up to 1:20' },
        { label: 'Commission', value: 'From 0%' },
        { label: 'Min Lot', value: '1 Share' },
        { label: 'Trading Hours', value: 'NYSE / NASDAQ' },
      ],
      features: [
        'Trade blue-chip equities with fractional contract sizing',
        'Seamless hedging of portfolio positions during quarterly earnings cycles',
        'Integrated fundamental news feed and earnings calendar',
      ],
      sampleSymbols: ['Apple', 'Microsoft', 'Nvidia', 'Tesla'],
    },
  ];

  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="red" size="md">
          FINANCIAL INSTRUMENTS
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Comprehensive Global Markets Suite
        </h1>
        <p className="text-sm sm:text-base text-neutral-300">
          Discover over 500+ demo CFD instruments across 6 diverse asset classes. Experience institutional-grade pricing, tight spreads, and ultra-reliable execution.
        </p>
      </div>

      {/* Product Sections */}
      <div className="space-y-12">
        {tradingProducts.map((product, idx) => (
          <section
            key={product.id}
            id={product.id}
            className="scroll-mt-24 p-6 sm:p-8 bg-[#0D0D0F] border border-neutral-800 rounded-2xl space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {product.title}
                  </h2>
                  <Badge variant="red" size="sm">
                    {product.badge}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl">{product.description}</p>
              </div>
              <Link to="/markets">
                <Button size="sm" className="whitespace-nowrap shrink-0">
                  VIEW MARKET <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Specifications Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#151518] p-4 rounded-xl border border-neutral-800/80 font-mono-num text-xs">
              {product.specs.map((spec, sIdx) => (
                <div key={sIdx}>
                  <span className="text-neutral-400 block text-[10px] uppercase font-semibold">
                    {spec.label}
                  </span>
                  <span className="font-bold text-white text-sm">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Features & Symbol Tags */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  Key Trading Advantages
                </h4>
                <ul className="space-y-2 text-xs text-neutral-300">
                  {product.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  Featured Instruments
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.sampleSymbols.map((sym, sIdx) => (
                    <Link
                      key={sIdx}
                      to="/markets"
                      className="px-3 py-1.5 bg-[#151518] hover:bg-neutral-800 border border-neutral-800 text-xs font-mono-num font-semibold text-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <TrendingUp className="w-3 h-3 text-red-500" />
                      <span>{sym}</span>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-[#121216] rounded-lg border border-neutral-800/80 text-[11px] text-neutral-400">
                  All market executions operate under demo conditions with simulated virtual settlement.
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-8">
        <Link to="/register">
          <Button size="lg" className="px-10">
            OPEN FREE DEMO ACCOUNT
          </Button>
        </Link>
      </div>
    </div>
  );
};
