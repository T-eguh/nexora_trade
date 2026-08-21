import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ShieldAlert, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../hooks/useStorage';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tradingDropdownOpen, setTradingDropdownOpen] = useState(false);
  const [accountsDropdownOpen, setAccountsDropdownOpen] = useState(false);
  const [platformsDropdownOpen, setPlatformsDropdownOpen] = useState(false);

  const { user, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  const tradingRef = useRef<HTMLDivElement>(null);
  const accountsRef = useRef<HTMLDivElement>(null);
  const platformsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setTradingDropdownOpen(false);
    setAccountsDropdownOpen(false);
    setPlatformsDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tradingRef.current && !tradingRef.current.contains(e.target as Node)) {
        setTradingDropdownOpen(false);
      }
      if (accountsRef.current && !accountsRef.current.contains(e.target as Node)) {
        setAccountsDropdownOpen(false);
      }
      if (platformsRef.current && !platformsRef.current.contains(e.target as Node)) {
        setPlatformsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#111317]/95 backdrop-blur-md border-b border-neutral-800">
      {/* Risk Warning Strip in Indonesian */}
      <div className="bg-[#181a20] border-b border-neutral-800/80 py-1 px-4 text-[11px] text-neutral-400 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 truncate">
          <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="truncate">
            <strong>Peringatan Risiko:</strong> Produk dengan leverage melibatkan risiko kerugian modal. Lingkungan akun demo trading & live STP.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 shrink-0 text-neutral-400 font-mono">
          <span>Waktu Server: UTC+0</span>
          <span>•</span>
          <span className="text-emerald-400">Sesi Trading: Aktif</span>
        </div>
      </div>

      {/* Top Bar: [Brand] - [Nav links] - [Actions] */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Wordmark matching Nexora Trade style */}
        <Link
          to="/"
          className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2.5 shrink-0"
        >
          <span className="w-7 h-7 rounded bg-red-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
            N
          </span>
          <span className="font-extrabold tracking-wider">
            NEXORA<span className="text-red-500 font-black text-sm ml-1">TRADE</span>
          </span>
        </Link>

        {/* Desktop Nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-neutral-300">
          <Link to="/" className="hover:text-white transition-colors">
            Beranda
          </Link>

          {/* Trading Dropdown */}
          <div className="relative" ref={tradingRef}>
            <button
              onClick={() => {
                setTradingDropdownOpen(!tradingDropdownOpen);
                setAccountsDropdownOpen(false);
                setPlatformsDropdownOpen(false);
              }}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer py-2"
            >
              <span>Produk Trading</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                  tradingDropdownOpen ? 'rotate-180 text-red-500' : ''
                }`}
              />
            </button>

            {tradingDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-[#1a1c23] border border-neutral-700 rounded-xl shadow-2xl p-2 z-50 animate-fadeIn">
                <Link
                  to="/markets"
                  className="block px-3 py-2 text-xs font-bold text-white hover:bg-neutral-800 rounded-lg"
                >
                  Semua Pasar & Instrumen
                </Link>
                <div className="h-px bg-neutral-800 my-1" />
                <Link
                  to="/trading#forex"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white rounded-lg"
                >
                  Forex Currencies
                </Link>
                <Link
                  to="/trading#gold"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white rounded-lg"
                >
                  Logam Mulia (Gold / Emas)
                </Link>
                <Link
                  to="/trading#crypto"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white rounded-lg"
                >
                  Mata Uang Kripto
                </Link>
                <Link
                  to="/trading#indices"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white rounded-lg"
                >
                  Indeks Saham Global
                </Link>
              </div>
            )}
          </div>

          {/* Accounts Dropdown */}
          <div className="relative" ref={accountsRef}>
            <button
              onClick={() => {
                setAccountsDropdownOpen(!accountsDropdownOpen);
                setTradingDropdownOpen(false);
                setPlatformsDropdownOpen(false);
              }}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer py-2"
            >
              <span>Tipe Akun</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                  accountsDropdownOpen ? 'rotate-180 text-red-500' : ''
                }`}
              />
            </button>

            {accountsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1a1c23] border border-neutral-700 rounded-xl shadow-2xl p-2 z-50 animate-fadeIn">
                <Link
                  to="/accounts"
                  className="block px-3 py-2 text-xs font-bold text-white hover:bg-neutral-800 rounded-lg"
                >
                  Bandingkan Semua Akun
                </Link>
                <div className="h-px bg-neutral-800 my-1" />
                <Link
                  to="/accounts#cent"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white rounded-lg"
                >
                  Cent Account (1:1000)
                </Link>
                <Link
                  to="/accounts#pro"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white rounded-lg"
                >
                  Pro Account
                </Link>
                <Link
                  to="/accounts#zero"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white rounded-lg"
                >
                  Zero Spread Raw
                </Link>
              </div>
            )}
          </div>

          <Link to="/platforms" className="hover:text-white transition-colors">
            Platform Trading
          </Link>
          <Link to="/education" className="hover:text-white transition-colors">
            Edukasi
          </Link>
          <Link to="/about" className="hover:text-white transition-colors">
            Tentang Kami
          </Link>
        </nav>

        {/* Right Primary Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to={isAdmin ? '/admin' : '/dashboard'}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#22252e] border border-neutral-700 hover:border-neutral-500 rounded-lg transition-colors"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAdmin ? 'Portal Admin' : 'Portal Klien'}</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors"
              >
                MASUK
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                DAFTAR AKUN
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#16181f] border-b border-neutral-800 px-4 pt-3 pb-6 space-y-3 animate-fadeIn text-xs">
          <div className="space-y-1">
            <Link
              to="/"
              className="block py-2 px-3 font-semibold text-neutral-200 hover:bg-neutral-800 rounded-lg"
            >
              Beranda
            </Link>
            <Link
              to="/markets"
              className="block py-2 px-3 font-semibold text-neutral-200 hover:bg-neutral-800 rounded-lg"
            >
              Pasar & Instrumen
            </Link>
            <Link
              to="/accounts"
              className="block py-2 px-3 font-semibold text-neutral-200 hover:bg-neutral-800 rounded-lg"
            >
              Tipe Akun Trading
            </Link>
            <Link
              to="/platforms"
              className="block py-2 px-3 font-semibold text-neutral-200 hover:bg-neutral-800 rounded-lg"
            >
              Platform Trading (WebTrader & MT5)
            </Link>
            <Link
              to="/education"
              className="block py-2 px-3 font-semibold text-neutral-200 hover:bg-neutral-800 rounded-lg"
            >
              Edukasi Trading
            </Link>
            <Link
              to="/about"
              className="block py-2 px-3 font-semibold text-neutral-200 hover:bg-neutral-800 rounded-lg"
            >
              Tentang Nexora Trade
            </Link>
          </div>

          <div className="pt-3 border-t border-neutral-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className="w-full py-2.5 px-4 text-center font-bold uppercase tracking-wider text-white bg-[#15803d] rounded-lg"
              >
                Buka {isAdmin ? 'Portal Admin' : 'Portal Klien'}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full py-2.5 px-4 text-center font-bold uppercase tracking-wider text-neutral-300 bg-[#22252e] border border-neutral-700 rounded-lg"
                >
                  MASUK
                </Link>
                <Link
                  to="/register"
                  className="w-full py-2.5 px-4 text-center font-bold uppercase tracking-wider text-white bg-red-600 rounded-lg"
                >
                  BUKA AKUN LIVE
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
