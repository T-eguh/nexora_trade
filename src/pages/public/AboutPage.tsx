import React from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Globe2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { SITE_STATS } from '../../data/site';

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

      {/* Hero Visual Section */}
      <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden border border-neutral-800">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
          alt="Nexora Global Financial Infrastructure"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover brightness-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 max-w-2xl space-y-2">
          <Badge variant="neutral" size="sm" className="bg-black/70 backdrop-blur-sm">
            GLOBAL HEADQUARTERS & TRADING NODES
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Ultra-Low Latency Fiber Infrastructure
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300">
            Equinix LD4 (London) & NY4 (New York) cross-connected data centers ensuring sub-millisecond order dispatch.
          </p>
        </div>
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
              <p className="text-[11px] text-neutral-400">{s.description}</p>
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

      {/* Action CTA */}
      <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-red-950/40 via-neutral-900 to-neutral-900 border border-red-900/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-2xl font-bold text-white">Experience Nexora Trade Demo</h3>
          <p className="text-xs text-neutral-400">
            Open a risk-free virtual demo account credited with $10,000 in simulated balance.
          </p>
        </div>
        <Link to="/register">
          <Button size="lg" className="whitespace-nowrap">
            Open Free Demo Account <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
