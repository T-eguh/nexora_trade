import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Layers,
  Globe2,
  Lock,
  Smartphone,
  BarChart3,
  Calculator,
  BookOpen,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { TradingTerminalMock } from '../../components/TradingTerminalMock';
import { Accordion, AccordionItem } from '../../components/Accordion';
import { SITE_STATS, INITIAL_SITE_SETTINGS } from '../../data/site';
import { useMarkets, useFaqs } from '../../hooks/useStorage';
import { ACCOUNT_TIERS } from '../../data/accounts';

export const HomePage: React.FC = () => {
  const { markets } = useMarkets();
  const { faqs } = useFaqs();

  // Ticker items
  const tickerMarkets = markets.slice(0, 8);

  const productCards = [
    {
      title: 'Forex Currencies',
      count: '60+ Pairs',
      desc: 'Trade major, minor, and exotic currency pairs with ultra-tight spreads and high liquidity.',
      tag: 'Spreads from 0.0 pips',
      link: '/trading#forex',
    },
    {
      title: 'Precious Metals',
      count: 'Gold & Silver',
      desc: 'Hedge market risk with spot XAU/USD and XAG/USD with flexible contract sizing.',
      tag: 'Safe-haven assets',
      link: '/trading#gold',
    },
    {
      title: 'Global Indices',
      count: '15+ Benchmarks',
      desc: 'Track US Tech 100, S&P 500, DAX 40, and FTSE with competitive margin rates.',
      tag: 'Deep liquidity',
      link: '/trading#indices',
    },
    {
      title: 'Commodities & Oil',
      count: 'WTI & Brent',
      desc: 'Speculate on crude oil, natural gas, and agricultural energy assets in real time.',
      tag: 'Direct market pricing',
      link: '/trading#commodities',
    },
    {
      title: 'Cryptocurrencies',
      count: 'BTC, ETH, SOL',
      desc: 'Trade 24/7 digital currency derivatives without requiring an external crypto wallet.',
      tag: '24/7 Trading',
      link: '/trading#crypto',
    },
    {
      title: 'CFD Equities',
      count: 'Global Shares',
      desc: 'Access leading US and European tech giants with transparent fractional share sizing.',
      tag: 'Long & Short CFDs',
      link: '/trading#cfds',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 overflow-hidden pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Next-Gen Financial Infrastructure</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                TRADE SMARTER.{' '}
                <span className="text-red-500 block">GROW WITH CONFIDENCE.</span>
              </h1>
              <p className="text-base sm:text-lg text-neutral-300 max-w-xl font-normal leading-relaxed">
                Access global markets through a modern trading experience designed for today's traders. Execute Forex, Metals, Indices, Commodities, and Crypto with institutional precision.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto px-8">
                  OPEN LIVE ACCOUNT
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                  TRY DEMO
                </Button>
              </Link>
            </div>

            {/* Micro assurances */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-neutral-800/80 text-xs text-neutral-400">
              <div>
                <strong className="text-white block font-mono-num">0.0 Pips</strong>
                <span>Raw Spread Tier</span>
              </div>
              <div>
                <strong className="text-white block font-mono-num">&lt;15ms</strong>
                <span>Simulated Latency</span>
              </div>
              <div>
                <strong className="text-white block font-mono-num">500+</strong>
                <span>Instruments</span>
              </div>
            </div>
          </div>

          {/* Right Mock Trading Terminal */}
          <div className="lg:col-span-6 w-full">
            <TradingTerminalMock />
          </div>
        </div>
      </section>

      {/* 2. LIVE MARKET TICKER STRIP */}
      <section className="border-y border-neutral-800 bg-[#0A0A0C] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
            {tickerMarkets.map((item) => {
              const isPos = item.change >= 0;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-2.5 px-3 py-1 rounded-lg bg-[#111114] border border-neutral-800/60 font-mono-num text-xs whitespace-nowrap shrink-0"
                >
                  <span className="font-bold text-white">{item.symbol}</span>
                  <span className="text-neutral-300">{item.bid.toFixed(item.digits)}</span>
                  <span
                    className={`font-semibold ${
                      isPos ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {isPos ? '+' : ''}
                    {item.changePercent.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. STATISTICS SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {SITE_STATS.map((stat, idx) => (
            <Card key={idx} padding="md" className="border-neutral-800/80 bg-[#0D0D0F]">
              <div className="space-y-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono-num tracking-tight">
                  {stat.value}
                </span>
                <h4 className="text-sm font-bold text-red-500 uppercase tracking-wider">
                  {stat.label}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed pt-1">
                  {stat.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. TRADING PRODUCTS GRID */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-500 block mb-1">
              Multi-Asset Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Trade Diversified Global Instruments
            </h2>
          </div>
          <Link to="/trading">
            <Button variant="secondary" size="sm">
              View All Products <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productCards.map((prod, idx) => (
            <Card key={idx} hoverEffect padding="md" className="flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="red" size="sm">
                    {prod.count}
                  </Badge>
                  <span className="text-[11px] font-mono-num text-neutral-400">{prod.tag}</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                  {prod.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{prod.desc}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-neutral-800/80">
                <Link
                  to={prod.link}
                  className="inline-flex items-center text-xs font-semibold text-neutral-300 group-hover:text-white transition-colors"
                >
                  VIEW MARKET <ChevronRight className="w-3.5 h-3.5 ml-1 text-red-500" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. ACCOUNT COMPARISON PREVIEW */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="red" size="sm">
            DEMO CONDITIONS
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Account Tiers Built for Every Strategy
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Choose the ideal execution profile with transparent demo parameters and competitive spreads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACCOUNT_TIERS.map((tier) => (
            <Card
              key={tier.type}
              hoverEffect
              padding="md"
              className={`flex flex-col justify-between relative ${
                tier.popular ? 'border-red-600/80 bg-[#120e10]' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wider py-0.5 px-2.5 rounded-full shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white">{tier.type}</h3>
                  <p className="text-xs text-neutral-400 mt-1 min-h-[32px]">{tier.tagline}</p>
                </div>

                <div className="py-3 border-y border-neutral-800/80 my-3 font-mono-num space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Min. Deposit:</span>
                    <span className="font-bold text-white">{tier.minDeposit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Spread From:</span>
                    <span className="font-bold text-emerald-400">{tier.spreadFrom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Commission:</span>
                    <span className="font-bold text-white">{tier.commission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Max Leverage:</span>
                    <span className="font-bold text-white">{tier.leverage}</span>
                  </div>
                </div>

                <ul className="space-y-2 my-4 text-xs text-neutral-300">
                  {tier.features.slice(0, 4).map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-neutral-800/80">
                <Link to="/register">
                  <Button
                    variant={tier.popular ? 'primary' : 'secondary'}
                    fullWidth
                    size="sm"
                  >
                    OPEN ACCOUNT
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. PLATFORMS & MOBILE ECOSYSTEM */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-b from-[#0D0D0F] to-[#070709] border border-neutral-800 rounded-2xl p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 text-left">
              <Badge variant="red" size="sm">
                HIGH-SPEED EXECUTION
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Trade Anywhere with Nexora Multi-Platform Suite
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Whether at your desk on Nexora WebTrader or trading on-the-go via our mobile terminal, access high-speed market charting, real-time depth of market, and instant simulated order routing.
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs font-medium text-neutral-300">
                <div className="p-3 bg-[#151518] rounded-lg border border-neutral-800 flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-red-500" />
                  <span>50+ Chart Indicators</span>
                </div>
                <div className="p-3 bg-[#151518] rounded-lg border border-neutral-800 flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-red-500" />
                  <span>One-Click Trading</span>
                </div>
                <div className="p-3 bg-[#151518] rounded-lg border border-neutral-800 flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-red-500" />
                  <span>iOS & Android Ready</span>
                </div>
                <div className="p-3 bg-[#151518] rounded-lg border border-neutral-800 flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-red-500" />
                  <span>MT4 / MT5 Integration</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/platforms">
                  <Button size="md">Explore Platforms</Button>
                </Link>
                <Link to="/tools">
                  <Button variant="secondary" size="md">
                    Trading Calculators
                  </Button>
                </Link>
              </div>
            </div>

            {/* Platform Preview Visual */}
            <div className="bg-[#050505] p-5 rounded-xl border border-neutral-800 font-mono-num space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
                <div className="flex items-center gap-2 text-white font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Nexora WebTrader v2.4 (Live Demo Feed)</span>
                </div>
                <span className="text-neutral-400 text-[10px]">Ping: 8ms</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-[#121216] rounded border border-neutral-800">
                  <span className="text-neutral-500 block text-[10px]">Active Orders</span>
                  <span className="font-bold text-white text-sm">2 Pending</span>
                </div>
                <div className="p-2.5 bg-[#121216] rounded border border-neutral-800">
                  <span className="text-neutral-500 block text-[10px]">Open Lots</span>
                  <span className="font-bold text-white text-sm">1.60 Lots</span>
                </div>
                <div className="p-2.5 bg-[#121216] rounded border border-neutral-800">
                  <span className="text-neutral-500 block text-[10px]">Daily P/L</span>
                  <span className="font-bold text-emerald-400 text-sm">+$683.40</span>
                </div>
              </div>
              <div className="p-3 bg-[#121216] rounded-lg border border-neutral-800 text-xs text-neutral-300 space-y-1.5 font-sans">
                <p className="font-bold text-white flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-red-500" /> Enterprise-Grade Data Isolation
                </p>
                <p className="text-neutral-400 text-[11px]">
                  All client transactions, security keys, and trade history are isolated with client-side tokenization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE NEXORA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="red" size="sm">
            CORE ADVANTAGES
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Why Professional Traders Choose Nexora
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            A disciplined approach to liquidity aggregation, transparent pricing models, and client empowerment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="md" className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Ultra-Low Latency Bridge</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Order routing designed to minimize slippage during volatile macroeconomic news events.
            </p>
          </Card>

          <Card padding="md" className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Transparent Account Models</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Clear spreads, transparent commission calculations, and zero hidden account maintenance fees.
            </p>
          </Card>

          <Card padding="md" className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">24/7 Multilingual Support</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Dedicated client assistance desks available round the clock through ticketing and direct channels.
            </p>
          </Card>
        </div>
      </section>

      {/* 8. FAQ ACCORDION SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-neutral-400">
            Answers to common questions about demo trading conditions, account tiers, and platform features.
          </p>
        </div>

        <Accordion>
          {faqs.slice(0, 5).map((faq) => (
            <AccordionItem key={faq.id} title={faq.question}>
              {faq.answer}
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center pt-2">
          <Link to="/faq" className="text-xs font-semibold text-red-400 hover:underline">
            View All Frequently Asked Questions →
          </Link>
        </div>
      </section>

      {/* 9. BOTTOM CTA BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-red-950/60 via-[#111114] to-[#0D0D0F] border border-red-900/40 rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to Experience Nexora Trade?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300">
              Open your free demo trading account in under 60 seconds with virtual capital.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link to="/register">
              <Button size="lg" className="px-8">
                OPEN DEMO ACCOUNT
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="px-6">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
