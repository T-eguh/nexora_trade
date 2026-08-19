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

  // Close dropdowns on outside click or route change
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
    <header className="sticky top-0 z-50 w-full bg-[#050505]/95 backdrop-blur-md border-b border-neutral-800/80">
      {/* Risk Warning Ticker Strip */}
      <div className="bg-[#0e0e11] border-b border-neutral-900 py-1 px-4 text-[11px] text-neutral-400 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 truncate">
          <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="truncate">
            <strong>Risk Warning:</strong> Trading leveraged products involves significant risk of loss. Demo environment for simulated testing.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 shrink-0 text-neutral-400 font-mono-num">
          <span>Server Time: UTC+0</span>
          <span>•</span>
          <span className="text-emerald-400">Trading Sessions: Active</span>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 Zones: [Brand] - [Nav links] - [Actions] */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link
          to="/"
          className="text-xl font-black tracking-tight text-white flex items-center gap-2 group whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
        >
          <span className="w-7 h-7 rounded bg-red-600 flex items-center justify-center text-white font-black text-sm">
            N
          </span>
          <span className="font-extrabold tracking-wider">
            NEXORA<span className="text-red-500">TRADE</span>
          </span>
        </Link>

        {/* Desktop Nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-300">
          {/* Trading Dropdown */}
          <div className="relative" ref={tradingRef}>
            <button
              onClick={() => {
                setTradingDropdownOpen(!tradingDropdownOpen);
                setAccountsDropdownOpen(false);
                setPlatformsDropdownOpen(false);
              }}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
            >
              <span>Trading</span>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  tradingDropdownOpen ? 'rotate-180 text-red-500' : ''
                }`}
              />
            </button>

            {tradingDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-[#0D0D0F] border border-neutral-800 rounded-xl shadow-2xl p-2 z-50 animate-fadeIn">
                <Link
                  to="/trading"
                  className="block px-3 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-800/80 hover:text-white rounded-lg transition-colors"
                >
                  All Instruments Overview
                </Link>
                <div className="h-px bg-neutral-800/80 my-1" />
                <Link
                  to="/trading#forex"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800/80 hover:text-white rounded-lg transition-colors"
                >
                  Forex Currencies
                </Link>
                <Link
                  to="/trading#gold"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800/80 hover:text-white rounded-lg transition-colors"
                >
                  Precious Metals & Gold
                </Link>
                <Link
                  to="/trading#indices"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800/80 hover:text-white rounded-lg transition-colors"
                >
                  Global Indices
                </Link>
                <Link
                  to="/trading#commodities"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800/80 hover:text-white rounded-lg transition-colors"
                >
                  Energy Commodities
                </Link>
                <Link
                  to="/trading#crypto"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800/80 hover:text-white rounded-lg transition-colors"
                >
                  Cryptocurrencies
                </Link>
                <Link
                  to="/trading#cfds"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800/80 hover:text-white rounded-lg transition-colors"
                >
                  CFD Contracts
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
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
            >
              <span>Accounts</span>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  accountsDropdownOpen ? 'rotate-180 text-red-500' : ''
                }`}
              />
            </button>

            {accountsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-[#0D0D0F] border border-neutral-800 rounded-xl shadow-2xl p-2 z-50 animate-fadeIn">
                <Link
                  to="/accounts"
                  className="block px-3 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-800/80 hover:text-white rounded-lg transition-colors"
                >
                  Compare All Accounts
                </Link>
                <div className="h-px bg-neutral-800/80 my-1" />
                <Link
                  to="/accounts#starter"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800/80 hover:text-white rounded-lg transition-colors"
                >
                  Starter Tier
                </Link>
                <Link
                  to="/accounts#pro"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800/80 hover:text-white rounded-lg transition-colors"
                >
                  Pro Tier (Popular)
                </Link>
                <Link
                  to="/accounts#zero"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800/80 hover:text-white rounded-lg transition-colors"
                >
                  Zero Spread (Raw ECN)
                </Link>
                <Link
                  to="/accounts#premium"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800/80 hover:text-white rounded-lg transition-colors"
                >
                  Premium VIP
                </Link>
              </div>
            )}
          </div>

          {/* Platforms Dropdown */}
          <div className="relative" ref={platformsRef}>
            <button
              onClick={() => {
                setPlatformsDropdownOpen(!platformsDropdownOpen);
                setTradingDropdownOpen(false);
                setAccountsDropdownOpen(false);
              }}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
            >
              <span>Platforms</span>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${
                  platformsDropdownOpen ? 'rotate-180 text-red-500' : ''
                }`}
              />
            </button>

            {platformsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-[#0D0D0F] border border-neutral-800 rounded-xl shadow-2xl p-2 z-50 animate-fadeIn">
                <Link
                  to="/platforms"
                  className="block px-3 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-800/80 hover:text-white rounded-lg transition-colors"
                >
                  Platform Ecosystem
                </Link>
                <div className="h-px bg-neutral-800/80 my-1" />
                <Link
                  to="/platforms#webtrader"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800/80 hover:text-white rounded-lg transition-colors"
                >
                  Nexora WebTrader
                </Link>
                <Link
                  to="/platforms#mt4"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800/80 hover:text-white rounded-lg transition-colors"
                >
                  MetaTrader 4 (MT4)
                </Link>
                <Link
                  to="/platforms#mt5"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800/80 hover:text-white rounded-lg transition-colors"
                >
                  MetaTrader 5 (MT5)
                </Link>
                <Link
                  to="/platforms#mobile"
                  className="block px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800/80 hover:text-white rounded-lg transition-colors"
                >
                  Nexora Mobile App
                </Link>
              </div>
            )}
          </div>

          <Link to="/markets" className="hover:text-white transition-colors">
            Markets
          </Link>
          <Link to="/tools" className="hover:text-white transition-colors">
            Tools
          </Link>
          <Link to="/education" className="hover:text-white transition-colors">
            Education
          </Link>
          <Link to="/about" className="hover:text-white transition-colors">
            About
          </Link>
        </nav>

        {/* Right Primary Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to={isAdmin ? '/admin' : '/dashboard'}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#18181b] border border-neutral-700 hover:border-neutral-600 rounded-lg transition-colors"
            >
              <User className="w-3.5 h-3.5 text-red-500" />
              <span>{isAdmin ? 'Admin Console' : 'Client Portal'}</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors"
              >
                LOGIN
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                OPEN ACCOUNT
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D0D0F] border-b border-neutral-800 px-4 pt-3 pb-6 space-y-4 animate-fadeIn">
          <div className="space-y-1">
            <Link
              to="/trading"
              className="block py-2 px-3 text-sm font-semibold text-neutral-200 hover:bg-neutral-800 rounded-lg"
            >
              Trading Products (Forex, Gold, Crypto...)
            </Link>
            <Link
              to="/accounts"
              className="block py-2 px-3 text-sm font-semibold text-neutral-200 hover:bg-neutral-800 rounded-lg"
            >
              Account Types (Starter, Pro, Zero, Premium)
            </Link>
            <Link
              to="/platforms"
              className="block py-2 px-3 text-sm font-semibold text-neutral-200 hover:bg-neutral-800 rounded-lg"
            >
              Platforms (WebTrader, MT4, MT5, Mobile)
            </Link>
            <Link
              to="/markets"
              className="block py-2 px-3 text-sm font-semibold text-neutral-200 hover:bg-neutral-800 rounded-lg"
            >
              Live Markets Explorer
            </Link>
            <Link
              to="/tools"
              className="block py-2 px-3 text-sm font-semibold text-neutral-200 hover:bg-neutral-800 rounded-lg"
            >
              Trading Calculators & Calendar
            </Link>
            <Link
              to="/education"
              className="block py-2 px-3 text-sm font-semibold text-neutral-200 hover:bg-neutral-800 rounded-lg"
            >
              Education Academy
            </Link>
            <Link
              to="/about"
              className="block py-2 px-3 text-sm font-semibold text-neutral-200 hover:bg-neutral-800 rounded-lg"
            >
              About Nexora Trade
            </Link>
            <Link
              to="/faq"
              className="block py-2 px-3 text-sm font-semibold text-neutral-200 hover:bg-neutral-800 rounded-lg"
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className="block py-2 px-3 text-sm font-semibold text-neutral-200 hover:bg-neutral-800 rounded-lg"
            >
              Contact Support
            </Link>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className="w-full py-2.5 px-4 text-center text-xs font-bold uppercase tracking-wider text-white bg-red-600 rounded-lg"
              >
                Go to {isAdmin ? 'Admin Console' : 'Client Dashboard'}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full py-2.5 px-4 text-center text-xs font-bold uppercase tracking-wider text-neutral-300 bg-[#151518] border border-neutral-700 rounded-lg"
                >
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  className="w-full py-2.5 px-4 text-center text-xs font-bold uppercase tracking-wider text-white bg-red-600 rounded-lg"
                >
                  OPEN LIVE ACCOUNT
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
