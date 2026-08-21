import React, { useState } from 'react';
import { useAccounts, useAuth } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { AccountTierType, TradingAccount } from '../../types';
import { Link } from 'react-router-dom';
import {
  Plus,
  ArrowDownCircle,
  TrendingUp,
  CheckCircle2,
  X,
  ShieldCheck,
} from 'lucide-react';

export const TradingAccountsPage: React.FC = () => {
  const { accounts } = useAccounts();
  const { user } = useAuth();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<AccountTierType>('Pro');
  const [leverage, setLeverage] = useState('1000');
  const [initialDeposit, setInitialDeposit] = useState('1000');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const accNum = `205128${Math.floor(100 + Math.random() * 900)}`;
    const newAcc: Omit<TradingAccount, 'id'> = {
      userId: user.id,
      accountId: accNum,
      accountNumber: accNum,
      type: selectedTier,
      tier: selectedTier,
      currency: 'USD',
      balance: parseFloat(initialDeposit) || 1000,
      equity: parseFloat(initialDeposit) || 1000,
      margin: 0,
      marginUsed: 0,
      freeMargin: parseFloat(initialDeposit) || 1000,
      leverage: `1:${leverage}`,
      server: 'Nexora-Live-01',
      status: 'active',
    };

    StorageService.addAccount(newAcc);
    setSuccessMsg(`Akun Trading #${newAcc.accountNumber} berhasil dibuat!`);
    setTimeout(() => {
      setSuccessMsg(null);
      setCreateModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            Pengelolaan Akun Trading
          </h1>
          <p className="text-xs text-neutral-500">
            Buka akun trading baru, atur rasio leverage, dan kelola alokasi modal trading Anda.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Buka Akun Trading Baru</span>
        </button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                    Nomor Akun
                  </span>
                  <strong className="text-base font-bold text-neutral-900 font-mono">
                    #{acc.accountNumber}
                  </strong>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {acc.tier || 'Cent news'}
                </span>
              </div>

              <div className="py-3 space-y-2.5 font-sans text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Saldo:</span>
                  <strong className="text-neutral-900 font-mono">
                    ${acc.balance.toLocaleString('id-ID', { minimumFractionDigits: 2 })} USD
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Ekuitas:</span>
                  <strong className="text-emerald-700 font-mono">
                    ${acc.equity.toLocaleString('id-ID', { minimumFractionDigits: 2 })} USD
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Leverage:</span>
                  <span className="font-mono text-neutral-800">{acc.leverage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Server:</span>
                  <span className="text-neutral-700 font-mono text-[11px]">{acc.server}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Status:</span>
                  <span className="text-emerald-700 font-bold text-[11px] uppercase">
                    Aktif / Terverifikasi
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 grid grid-cols-2 gap-2">
              <Link
                to="/dashboard/deposit"
                className="py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-lg transition-colors text-center"
              >
                Deposit
              </Link>
              <Link
                to="/dashboard/markets"
                className="py-2 px-3 bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs rounded-lg transition-colors text-center shadow"
              >
                Trading Sekarang
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Create Account Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-base font-bold text-neutral-900">
                Buka Akun Trading Baru
              </h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMsg ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-neutral-900">{successMsg}</h4>
              </div>
            ) : (
              <form onSubmit={handleCreateAccount} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Tipe Akun
                  </label>
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value as AccountTierType)}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs font-medium"
                  >
                    <option value="Pro">Cent / Pro Tier (1:1000) [Populer]</option>
                    <option value="Zero">Zero Spread (0.0 Pip Raw)</option>
                    <option value="Starter">Starter Micro</option>
                    <option value="Premium">Premium VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Leverage Akun
                  </label>
                  <select
                    value={leverage}
                    onChange={(e) => setLeverage(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs font-medium"
                  >
                    <option value="500">1:500</option>
                    <option value="1000">1:1000 (Direkomendasikan)</option>
                    <option value="2000">1:2000</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Saldo Awal (USD)
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="100"
                    required
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#15803d] hover:bg-[#166534] text-white font-bold rounded-lg shadow"
                  >
                    Buat Akun
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
