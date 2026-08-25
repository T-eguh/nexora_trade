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

  const balance = primaryAccount?.balance ?? 0.0;
  const equity = balance + totalOpenPnl;
  const marginUsed = primaryAccount?.margin || 0.0;
  const freeMargin = Math.max(0, equity - marginUsed);

  const kycStatus = user?.kycStatus || 'unverified';

  return (
    <div className="space-y-5 font-sans">
      {/* KYC Reminder Banner if not verified */}
      {kycStatus !== 'verified' && (
        <div className="p-3.5 bg-neutral-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm border border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0 font-bold">
              !
            </div>
            <div>
              <strong className="text-xs font-bold block">
                {kycStatus === 'pending'
                  ? 'Dokumen KTP Anda Sedang Ditinjau Admin'
                  : 'Verifikasi Akun: Upload Foto KTP Anda'}
              </strong>
              <p className="text-[11px] text-neutral-300">
                {kycStatus === 'pending'
                  ? 'Admin sedang memverifikasi foto KTP yang Anda kirim. Mohon tunggu proses aktivasi penuh.'
                  : 'Cukup isi form dokumen dan unggah foto KTP asli Anda tanpa scan wajah rumit.'}
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/verification"
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap self-start sm:self-center"
          >
            {kycStatus === 'pending' ? 'Cek Status KTP' : 'Upload Foto KTP Sekarang'}
          </Link>
        </div>
      )}

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
