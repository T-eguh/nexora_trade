import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import {
  Monitor,
  Smartphone,
  Layers,
  BarChart2,
  ListOrdered,
  Eye,
  History,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const PlatformsPage: React.FC = () => {
  const platforms = [
    {
      id: 'webtrader',
      name: 'Nexora WebTrader',
      tagline: 'High-performance browser terminal. Zero installation required.',
      type: 'Web Application',
      icon: Monitor,
      image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80',
      desc: 'Built with ultra-modern web technologies, Nexora WebTrader delivers institutional trading capability directly within your browser on Windows, macOS, or Linux.',
      features: [
        'Advanced interactive SVG & HTML5 charting engines',
        'Direct 1-Click Order Execution with customizable presets',
        'Customizable Multi-Watchlist management',
        'Full order history, position modification, and trailing stops',
        'Real-time Level II Depth of Market (DOM) inspection',
      ],
      actionLabel: 'Launch WebTrader',
      actionLink: '/dashboard',
    },
    {
      id: 'mt4',
      name: 'MetaTrader 4 (MT4)',
      tagline: 'The world benchmark for algorithmic Forex and automated EA strategies.',
      type: 'Desktop & Mobile',
      icon: Layers,
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
      desc: 'The industry-standard platform favored by millions of traders worldwide. Renowned for custom MQL4 indicators, automated trading robots, and extensive backtesting environments.',
      features: [
        'Automated Expert Advisor (EA) trading execution',
        'Over 30 built-in technical indicators and 24 analytical objects',
        '9 standard timeframes with tick-by-tick charting',
        'Multi-terminal account management capability',
      ],
      actionLabel: 'Download MT4 Setup (Demo)',
      actionLink: '/register',
    },
    {
      id: 'mt5',
      name: 'MetaTrader 5 (MT5)',
      tagline: 'Next-generation multi-asset terminal with expanded market depth.',
      type: 'Desktop & Mobile',
      icon: Layers,
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
      desc: 'The premier multi-asset powerhouse supporting 21 timeframes, native economic calendar integration, integrated MQL5 development environment, and Level II Depth of Market.',
      features: [
        '21 timeframes and 6 types of pending orders',
        'Embedded Economic Calendar with high-impact alert filters',
        'Native multi-threaded strategy tester for algorithmic EAs',
        'Integrated Depth of Market (DOM) with direct pricing',
      ],
      actionLabel: 'Download MT5 Setup (Demo)',
      actionLink: '/register',
    },
    {
      id: 'mobile',
      name: 'Nexora Mobile App',
      tagline: 'Full trading power in the palm of your hand for iOS & Android.',
      type: 'Mobile iOS / Android',
      icon: Smartphone,
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
      desc: 'Never miss a market breakout. Monitor live pricing, execute instant positions, manage margin levels, and receive real-time price push notifications anywhere.',
      features: [
        'Biometric Face ID & Fingerprint secure authentication',
        'Push notifications for critical economic releases and margin alerts',
        'Full touchscreen charting with multi-touch pinch to zoom',
        'Fast 1-tap deposit and withdrawal status tracking',
      ],
      actionLabel: 'Get Mobile App (Demo)',
      actionLink: '/register',
    },
  ];

  const coreCapabilities = [
    {
      icon: BarChart2,
      title: 'Advanced Charts',
      desc: 'Full suite of technical indicators, trendlines, Fibonacci retracements, and multiple timeframes.',
    },
    {
      icon: Eye,
      title: 'Market Watch',
      desc: 'Real-time bid/ask quotes streaming across Forex, Metals, Energies, Indices, and Cryptos.',
    },
    {
      icon: ListOrdered,
      title: 'Order Management',
      desc: 'Market, Limit, Stop, and Trailing Stop orders with custom Take Profit and Stop Loss protections.',
    },
    {
      icon: History,
      title: 'Trade History',
      desc: 'Complete auditable transaction logs, closed trade statements, and downloadable PDF reports.',
    },
  ];

  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="red" size="md">
          TRADING INTERFACES
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Next-Generation Platform Ecosystem
        </h1>
        <p className="text-sm sm:text-base text-neutral-300">
          Execute trades seamlessly across desktop, browser, and mobile devices with synchronized accounts, real-time market feeds, and zero latency bottlenecks.
        </p>
      </div>

      {/* Capabilities 4-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {coreCapabilities.map((cap, idx) => (
          <Card key={idx} padding="md" className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#151518] border border-neutral-800 flex items-center justify-center text-red-500">
              <cap.icon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">{cap.title}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">{cap.desc}</p>
          </Card>
        ))}
      </div>

      {/* Detailed Platforms List */}
      <div className="space-y-10">
        {platforms.map((platform) => (
          <section
            key={platform.id}
            id={platform.id}
            className="scroll-mt-24 bg-[#0D0D0F] border border-neutral-800 rounded-2xl overflow-hidden"
          >
            {/* Visual Header Banner */}
            <div className="relative h-48 sm:h-64 w-full overflow-hidden border-b border-neutral-800">
              <img
                src={platform.image}
                alt={platform.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-75 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F] via-[#0D0D0F]/40 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-black/70 backdrop-blur-sm border border-neutral-700 flex items-center justify-center text-red-500 shadow-xl">
                    <platform.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-md">
                      {platform.name}
                    </h2>
                    <p className="text-xs text-neutral-300 drop-shadow-sm">{platform.tagline}</p>
                  </div>
                </div>
                <Badge variant="neutral" size="sm" className="hidden sm:inline-flex bg-black/60 backdrop-blur-sm">
                  {platform.type}
                </Badge>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-sm text-neutral-300 leading-relaxed max-w-4xl">
                {platform.desc}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    Core Platform Features
                  </h4>
                  <ul className="space-y-2.5 text-xs text-neutral-300">
                    {platform.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#151518] p-5 rounded-xl border border-neutral-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h5 className="text-sm font-bold text-white">Get Started with {platform.name}</h5>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Test your strategies with virtual demo balance in this fully simulated execution environment.
                    </p>
                  </div>
                  <div>
                    <Link to={platform.actionLink}>
                      <Button size="md" className="w-full sm:w-auto">
                        {platform.actionLabel} <ExternalLink className="w-4 h-4 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
