import React from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Layers,
  Cpu,
  Globe2,
  Users,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { SITE_STATS, INITIAL_SITE_SETTINGS } from '../../data/site';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="red" size="md">
          ABOUT NEXORA TRADE
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Pioneering Modern Financial Technology
        </h1>
        <p className="text-sm sm:text-base text-neutral-300">
          Built from the ground up for modern traders who demand low-latency market infrastructure, transparent liquidity models, and high-performance execution tools.
        </p>
      </div>

      {/* Core Mission Statement */}
      <div className="bg-[#0D0D0F] border border-neutral-800 rounded-2xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Our Architectural Vision
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            At Nexora Trade, we bridge the gap between institutional interbank connectivity and retail traders. Our platform is engineered around three uncompromising pillars: speed of execution, algorithmic stability, and clean, unencumbered user experience.
          </p>
          <p className="text-xs text-neutral-400 leading-relaxed">
            By eliminating unnecessary legacy complexities, Nexora provides traders with direct pricing, tight floating spreads, and comprehensive risk simulation tools.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {SITE_STATS.map((s, idx) => (
            <div key={idx} className="p-4 bg-[#151518] rounded-xl border border-neutral-800 space-y-1">
              <span className="text-2xl font-black text-white font-mono-num">{s.value}</span>
              <h4 className="text-xs font-bold text-red-500 uppercase">{s.label}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Pillars */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Our Engineering Principles</h2>
          <p className="text-xs text-neutral-400">
            Every feature on Nexora Trade is deliberate, tested, and optimized for performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="md" className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#151518] border border-neutral-800 flex items-center justify-center text-red-500">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero-Compromise Latency</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Order routing designed to simulate institutional sub-millisecond execution times without requotes.
            </p>
          </Card>

          <Card padding="md" className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#151518] border border-neutral-800 flex items-center justify-center text-red-500">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Client-Centric Security</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Data isolation, strict session controls, and encrypted storage protect account credentials.
            </p>
          </Card>

          <Card padding="md" className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#151518] border border-neutral-800 flex items-center justify-center text-red-500">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Global Reach</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Unified access across all major asset classes, spanning European, North American, and Asian trading sessions.
            </p>
          </Card>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="p-6 bg-red-950/20 border border-red-900/40 rounded-xl space-y-2 text-neutral-400 text-xs">
        <h4 className="text-sm font-bold text-red-400">Notice on Simulated Operations</h4>
        <p>
          Nexora Trade is structured as an interactive demonstration trading portal. All market data, execution tickets, and balances operate in a virtual demo environment for training and analytical review.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link to="/register">
          <Button size="lg" className="px-8">
            START WITH DEMO ACCOUNT <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
