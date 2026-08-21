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
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
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
      image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
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
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
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
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
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
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80',
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
      image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80',
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
        {tradingProducts.map((product) => (
          <section
            key={product.id}
            id={product.id}
            className="scroll-mt-24 bg-[#0D0D0F] border border-neutral-800 rounded-2xl overflow-hidden"
          >
            {/* Visual Cover Banner */}
            <div className="relative h-44 sm:h-52 w-full overflow-hidden border-b border-neutral-800">
              <img
                src={product.image}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-60 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F] via-[#0D0D0F]/40 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="red" size="sm">
                      {product.badge}
                    </Badge>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-md">
                    {product.title}
                  </h2>
                </div>
                <Link to="/markets">
                  <Button size="sm" className="whitespace-nowrap shrink-0">
                    Trade {product.badge} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
                {product.description}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#151518] p-4 rounded-xl border border-neutral-800 font-mono-num text-xs">
                {product.specs.map((spec, sIdx) => (
                  <div key={sIdx} className="space-y-0.5">
                    <span className="text-neutral-500 uppercase text-[10px] block font-semibold">
                      {spec.label}
                    </span>
                    <span className="font-bold text-white text-sm">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Features and Symbols */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Instrument Advantages
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-300">
                    {product.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 bg-[#151518]/60 p-4 rounded-xl border border-neutral-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Popular Benchmark Assets
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sampleSymbols.map((sym, symIdx) => (
                      <span
                        key={symIdx}
                        className="px-3 py-1.5 bg-[#0D0D0F] rounded-lg text-xs font-bold text-white border border-neutral-700 font-mono-num flex items-center gap-1.5"
                      >
                        <TrendingUp className="w-3 h-3 text-red-400" />
                        {sym}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-neutral-400 pt-2">
                    Simulate real-time orders on all instruments with full live chart interactivity.
                  </p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
