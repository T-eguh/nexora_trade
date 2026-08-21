import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import {
  Menu,
  Bell,
  Smartphone,
  LayoutGrid,
  ChevronDown,
  Repeat,
  ArrowDownCircle,
  X,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { useAuth, useAccounts, usePositions } from '../hooks/useStorage';

export const DashboardLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [downloadAppModal, setDownloadAppModal] = useState(false);

  const { user } = useAuth();
  const { accounts } = useAccounts();
  const { positions } = usePositions();
  const navigate = useNavigate();

  const primaryAccount = accounts.find((a) => a.userId === user?.id) || accounts[0];

  const openPositions = positions.filter((p) => p.status === 'open');
  const totalOpenPnl = openPositions.reduce((acc, p) => acc + p.pnl, 0);

  const balance = primaryAccount?.balance || 0.68;
  const equity = balance + totalOpenPnl;
  const marginUsed = primaryAccount?.margin || 0.0;
  const freeMargin = Math.max(0, equity - marginUsed);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-800 flex flex-col font-sans">
      {/* Sidebar navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen min-w-0">
        {/* Top Header matching Video 2 */}
        <header className="h-16 bg-[#1a1c23] text-white sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between border-b border-neutral-800 shadow-sm">
          {/* Left: Account Pill & Balance (clickable to open account drawer) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAccountModalOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#272a34] hover:bg-[#323644] transition-colors border border-neutral-700/80 cursor-pointer text-left"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                Live
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 leading-tight">
                <span className="text-[11px] font-mono text-neutral-300">
                  #{primaryAccount?.accountNumber || '205128182'}
                </span>
                <span className="text-xs font-bold text-white font-mono">
                  c{balance.toFixed(2)}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 ml-0.5" />
            </button>
          </div>

          {/* Right: Quick Tools, Notifications, Grid, Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mobile App Download icon */}
            <button
              type="button"
              onClick={() => setDownloadAppModal(true)}
              className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Download APK Android"
            >
              <Smartphone className="w-4 h-4" />
            </button>

            {/* Notification Bell with 99+ badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors relative"
                title="Pemberitahuan"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-black px-1 py-0.2 rounded-full font-mono">
                  99+
                </span>
              </button>

              {/* Notification Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white text-neutral-800 rounded-xl shadow-2xl border border-neutral-200 p-3.5 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                    <span className="text-xs font-bold text-neutral-900">Pemberitahuan Pasar</span>
                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-neutral-400 hover:text-neutral-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="py-2 space-y-2 text-xs max-h-56 overflow-y-auto">
                    <div className="p-2 bg-neutral-50 rounded border border-neutral-200">
                      <strong className="block text-neutral-900 text-[11px]">Sesi Pasar New York Dibuka</strong>
                      <span className="text-[10px] text-neutral-500">Likuiditas instrumen Forex & Gold tinggi.</span>
                    </div>
                    <div className="p-2 bg-neutral-50 rounded border border-neutral-200">
                      <strong className="block text-neutral-900 text-[11px]">Server Live Siap</strong>
                      <span className="text-[10px] text-neutral-500">Eksekusi sub-milidetik STP aktif.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick App Grid */}
            <Link
              to="/dashboard/markets"
              className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors hidden sm:inline-flex"
              title="Terminal Instrumen"
            >
              <LayoutGrid className="w-4 h-4" />
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 space-y-5">
          <Outlet />
        </main>
      </div>

      {/* Account Info Modal / Bottom Sheet matching Video 2 */}
      {accountModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white text-neutral-900 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scaleUp">
            {/* Top Handle & Close */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                  Live
                </span>
                <span className="text-sm font-bold text-neutral-900">MT5</span>
              </div>
              <button
                type="button"
                onClick={() => setAccountModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Title and Switch */}
            <div className="flex items-center justify-between bg-neutral-50 p-3 rounded-xl border border-neutral-200">
              <div>
                <span className="text-[11px] text-neutral-500 font-medium block">
                  Akun trading:
                </span>
                <strong className="text-sm font-bold text-neutral-900 font-mono">
                  {primaryAccount?.accountNumber || '205128182'} - Cent news
                </strong>
              </div>
              <Repeat className="w-4 h-4 text-emerald-600" />
            </div>

            {/* Financial Spec Rows matching Video 2 */}
            <div className="space-y-3 font-sans text-xs">
              <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500 font-medium">Ekuitas</span>
                <span className="font-bold text-base text-neutral-900 font-mono">
                  c{equity.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Profit & Loss (P&L)</span>
                <span
                  className={`font-bold font-mono ${
                    totalOpenPnl >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {totalOpenPnl >= 0 ? '+' : ''}c{totalOpenPnl.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Leverage Akun</span>
                <span className="font-bold text-neutral-800 font-mono">1:1000</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Margin</span>
                <span className="font-bold text-neutral-800 font-mono">
                  c{marginUsed.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Bebas Margin</span>
                <span className="font-bold text-neutral-800 font-mono">
                  c{freeMargin.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-neutral-500">Panggilan Margin /Posisi akan ditutup</span>
                <span className="font-bold text-neutral-800 font-mono">50% / 20%</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setAccountModalOpen(false);
                  navigate('/dashboard/transactions');
                }}
                className="py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-lg transition-colors cursor-pointer text-center"
              >
                Transfer
              </button>
              <button
                type="button"
                onClick={() => {
                  setAccountModalOpen(false);
                  navigate('/dashboard/deposit');
                }}
                className="py-2.5 px-4 bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer text-center shadow"
              >
                Deposit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APK Android Download Modal */}
      {downloadAppModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              Download HFM Android App
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Dapatkan akses eksekusi trading langsung dari smartphone Android Anda dengan latensi rendah.
            </p>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-mono text-neutral-700">
              Versi APK: v2.4.1 (Stable Release)
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDownloadAppModal(false)}
                className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-lg"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  setDownloadAppModal(false);
                  alert('Unduhan APK Android HFM dimulai...');
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow"
              >
                Unduh APK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
