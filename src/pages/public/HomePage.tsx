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
  CheckCircle2,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { TradingTerminalMock } from '../../components/TradingTerminalMock';
import { useMarkets, useFaqs, useArticles } from '../../hooks/useStorage';
import { ACCOUNT_TIERS } from '../../data/accounts';

export const HomePage: React.FC = () => {
  const { markets } = useMarkets();
  const { faqs } = useFaqs();
  const { articles } = useArticles();

  const tickerMarkets = markets.slice(0, 8);

  const productCards = [
    {
      title: 'Mata Uang Forex',
      count: '60+ Pasangan',
      desc: 'Trading pasangan mata uang utama, minor, dan eksotik dengan spread ketat dan likuiditas tinggi.',
      tag: 'Spread mulai 0.0 pip',
      link: '/markets',
    },
    {
      title: 'Logam Mulia (Gold & Silver)',
      count: 'XAU/USD & XAG/USD',
      desc: 'Lindungi nilai portofolio Anda dengan komoditas emas spot dan ukuran kontrak yang fleksibel.',
      tag: 'Aset Safe-Haven',
      link: '/markets',
    },
    {
      title: 'Indeks Saham Global',
      count: '15+ Tolok Ukur',
      desc: 'Trading pergerakan US Tech 100, S&P 500, DAX 40, dan Dow Jones dengan margin kompetitif.',
      tag: 'Likuiditas Dalam',
      link: '/markets',
    },
    {
      title: 'Minyak & Energi',
      count: 'WTI & Brent Crude',
      desc: 'Spekulasi harga minyak mentah dan gas alam secara langsung pada waktu nyata.',
      tag: 'Harga Pasar Langsung',
      link: '/markets',
    },
    {
      title: 'Mata Uang Kripto',
      count: 'BTC, ETH, SOL',
      desc: 'Trading derivatif aset digital 24/7 tanpa memerlukan dompet crypto eksternal.',
      tag: 'Trading 24/7',
      link: '/markets',
    },
    {
      title: 'Saham Perusahaan Global',
      count: 'Apple, Tesla, Google',
      desc: 'Akses saham raksasa teknologi AS dan Eropa dengan fractional lot trading.',
      tag: 'CFD Long & Short',
      link: '/markets',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 overflow-hidden pb-16 font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 lg:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181a20] border border-neutral-800 text-xs font-semibold text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Infrastruktur Trading Finansial Terpercaya</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                TRADING LEBIH CERDAS.{' '}
                <span className="text-red-500 block">TUMBUH BERSAMA NEXORA TRADE.</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 max-w-xl font-normal leading-relaxed">
                Akses pasar global melalui pengalaman trading modern yang dirancang untuk trader Indonesia. Eksekusi Forex, Emas, Indeks, dan Kripto dengan kecepatan tinggi dan spread rendah.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to="/register"
                className="py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
              >
                <span>BUKA AKUN LIVE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="py-3 px-6 bg-[#22252e] hover:bg-[#2c303b] text-neutral-200 font-bold text-xs uppercase tracking-wider rounded-lg border border-neutral-700 transition-colors text-center"
              >
                COBA AKUN DEMO
              </Link>
            </div>

            {/* Micro Assurances */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-neutral-800 text-xs text-neutral-400">
              <div>
                <strong className="text-white block font-mono">0.0 Pip</strong>
                <span>Spread Terketat</span>
              </div>
              <div>
                <strong className="text-white block font-mono">&lt;15ms</strong>
                <span>Eksekusi Cepat STP</span>
              </div>
              <div>
                <strong className="text-white block font-mono">500+</strong>
                <span>Instrumen Pasar</span>
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
      <section className="border-y border-neutral-800 bg-[#12141a] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
            {tickerMarkets.map((item) => {
              const isPos = item.change >= 0;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#1a1c24] border border-neutral-700/60 font-mono text-xs whitespace-nowrap shrink-0"
                >
                  <span className="font-bold text-white">{item.symbol}</span>
                  <span className="text-neutral-300">{item.bid.toFixed(item.digits)}</span>
                  <span
                    className={`font-bold ${
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

      {/* 3. TRADING PRODUCTS GRID */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-500 block mb-1">
              Instrumen Pasar Finansial
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Pilihan Aset Multi-Pasar Global
            </h2>
          </div>
          <Link
            to="/markets"
            className="text-xs font-bold text-neutral-300 hover:text-white flex items-center gap-1 bg-[#1e2129] py-2 px-3.5 rounded-lg border border-neutral-700"
          >
            <span>Jelajahi Semua Pasar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {productCards.map((prod, idx) => (
            <div
              key={idx}
              className="bg-[#171920] border border-neutral-800 rounded-xl p-5 flex flex-col justify-between hover:border-neutral-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-red-900/40 text-red-400 border border-red-800/40 text-[10px] font-bold rounded">
                    {prod.count}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">{prod.tag}</span>
                </div>
                <h3 className="text-base font-bold text-white">{prod.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{prod.desc}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-neutral-800">
                <Link
                  to={prod.link}
                  className="inline-flex items-center text-xs font-bold text-neutral-300 hover:text-white transition-colors"
                >
                  <span>LIHAT HARGA PASAR</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1 text-red-500" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PLATFORMS & MOBILE TERMINAL */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#14161d] border border-neutral-800 rounded-2xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5 text-left">
              <span className="px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-300 border border-emerald-700 text-[10px] font-bold">
                EKSEKUSI KECEPATAN TINGGI
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Trading Kapan Saja dengan WebTrader & MT5
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Akses grafik interaktif real-time, depth of market, dan penempatan order 1-klik langsung dari browser Anda atau perangkat Android.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-medium text-neutral-300">
                <div className="p-3 bg-[#1c1f28] rounded-lg border border-neutral-700 flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-red-500" />
                  <span>50+ Indikator Chart</span>
                </div>
                <div className="p-3 bg-[#1c1f28] rounded-lg border border-neutral-700 flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-red-500" />
                  <span>Eksekusi 1-Klik</span>
                </div>
                <div className="p-3 bg-[#1c1f28] rounded-lg border border-neutral-700 flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-red-500" />
                  <span>Aplikasi Android Nexora Trade</span>
                </div>
                <div className="p-3 bg-[#1c1f28] rounded-lg border border-neutral-700 flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-red-500" />
                  <span>Integrasi MT4 / MT5</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors shadow"
                >
                  <span>Mulai Trading Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual Box */}
            <div className="bg-[#0b0c10] rounded-xl border border-neutral-800 p-4 space-y-4 font-mono text-xs shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-bold">Nexora WebTrader Live</span>
                </div>
                <span className="text-emerald-400 text-[11px]">Server: US New York (Amerikan) STP Live</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-[#181a22] rounded border border-neutral-700">
                  <span className="text-neutral-500 block text-[10px]">Order Aktif</span>
                  <span className="font-bold text-white text-xs">2 Terbuka</span>
                </div>
                <div className="p-2 bg-[#181a22] rounded border border-neutral-700">
                  <span className="text-neutral-500 block text-[10px]">Volume Lot</span>
                  <span className="font-bold text-white text-xs">0.50 Lot</span>
                </div>
                <div className="p-2 bg-[#181a22] rounded border border-neutral-700">
                  <span className="text-neutral-500 block text-[10px]">P/L Harian</span>
                  <span className="font-bold text-emerald-400 text-xs">+$142.50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-red-950/60 via-[#181a22] to-[#12141a] border border-red-900/40 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Siap Memulai Perjalanan Trading Anda?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300">
              Buka akun trading Anda dalam waktu kurang dari 1 menit dengan metode deposit lokal instan.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/register"
              className="py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow"
            >
              DAFTAR SEKARANG
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
