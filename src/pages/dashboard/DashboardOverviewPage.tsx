import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { HFMWebTrader } from '../../components/HFMWebTrader';
import { useAccounts, usePositions, useAuth } from '../../hooks/useStorage';

export const DashboardOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const { accounts } = useAccounts();
  const { positions } = usePositions();

  const primaryAccount = accounts.find((a) => a.userId === user?.id) || accounts[0];
  const openPositions = positions.filter((p) => p.status === 'open');
  const totalOpenPnl = openPositions.reduce((acc, p) => acc + p.pnl, 0);

  const balance = primaryAccount?.balance || 0.68;
  const equity = balance + totalOpenPnl;
  const marginUsed = primaryAccount?.margin || 0.0;
  const freeMargin = Math.max(0, equity - marginUsed);

  return (
    <div className="space-y-5 font-sans">
      {/* Account Overview Header */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              LIVE MT5 (US AMERIKAN)
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-neutral-900">
              Selamat datang, {user?.name || 'Trader Nexora'}
            </h1>
          </div>
          <p className="text-xs text-neutral-500">
            Akun Trading: <strong className="text-neutral-800 font-mono">#{primaryAccount?.accountNumber || '205128182'}</strong> • Server: <strong className="text-neutral-700">US New York (Amerikan) Live</strong>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/deposit"
            className="px-4 py-2 bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <ArrowDownCircle className="w-4 h-4" />
            <span>Deposit Dana</span>
          </Link>
          <Link
            to="/dashboard/withdrawal"
            className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 border border-neutral-300"
          >
            <ArrowUpCircle className="w-4 h-4 text-neutral-600" />
            <span>Penarikan</span>
          </Link>
          <Link
            to="/dashboard/transactions"
            className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 border border-neutral-300"
          >
            <Repeat className="w-4 h-4 text-neutral-600" />
            <span>Transfer</span>
          </Link>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] text-neutral-500 font-medium block">Saldo Akun</span>
          <span className="text-base sm:text-lg font-black text-neutral-900 font-mono">
            ${balance.toLocaleString('id-ID', { minimumFractionDigits: 2 })} USD
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] text-neutral-500 font-medium block">Total Ekuitas</span>
          <span className="text-base sm:text-lg font-black text-neutral-900 font-mono">
            ${equity.toLocaleString('id-ID', { minimumFractionDigits: 2 })} USD
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] text-neutral-500 font-medium block">Bebas Margin</span>
          <span className="text-base sm:text-lg font-black text-neutral-900 font-mono">
            ${freeMargin.toLocaleString('id-ID', { minimumFractionDigits: 2 })} USD
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-[11px] text-neutral-500 font-medium block">P/L Mengambang</span>
          <span
            className={`text-base sm:text-lg font-black font-mono ${
              totalOpenPnl >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {totalOpenPnl >= 0 ? '+' : ''}${totalOpenPnl.toFixed(2)} USD
          </span>
        </div>
      </div>

      {/* Integrated HFM WebTrader Terminal */}
      <div className="space-y-2">
        <HFMWebTrader />
      </div>
    </div>
  );
};
