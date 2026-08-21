import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts, useAuth } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { INDONESIA_PAYMENT_METHODS } from '../../data/payments';
import {
  ArrowUpCircle,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const WithdrawalPage: React.FC = () => {
  const { accounts } = useAccounts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const primaryAccount = accounts.find((a) => a.userId === user?.id) || accounts[0];

  const [selectedMethodId, setSelectedMethodId] = useState(INDONESIA_PAYMENT_METHODS[0].id);
  const [amountUsd, setAmountUsd] = useState('50');
  const [destAccount, setDestAccount] = useState('0812-9842-1109 (Atas Nama Saya)');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const selectedMethod = INDONESIA_PAYMENT_METHODS.find((m) => m.id === selectedMethodId) || INDONESIA_PAYMENT_METHODS[0];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const withAmount = parseFloat(amountUsd) || 0;

    if (withAmount <= 0) {
      setError('Harap masukkan nominal penarikan yang valid.');
      return;
    }

    if (withAmount > primaryAccount.balance) {
      setError(`Saldo tidak mencukupi. Saldo tersedia: $${primaryAccount.balance.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      StorageService.withdraw(
        primaryAccount.id,
        withAmount,
        `Penarikan ke ${selectedMethod.name} (${destAccount})`
      );
      setLoading(false);
      setSuccessMsg(
        `Permintaan penarikan sebesar $${withAmount.toLocaleString('id-ID')} USD via ${selectedMethod.name} berhasil diajukan!`
      );
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold">
            PENARIKAN DANA
          </span>
          <span className="text-xs text-neutral-500">Pencairan Dana ke Bank / E-Wallet Lokal</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
          Penarikan Dana (Withdrawal)
        </h1>
        <p className="text-xs text-neutral-500">
          Tarik profit hasil trading Anda ke rekening bank atau e-wallet Indonesia tanpa biaya admin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200 shadow-sm space-y-5">
          {successMsg ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Penarikan Berhasil Diajukan</h3>
              <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                {successMsg}
              </p>
              <div className="pt-3 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSuccessMsg(null);
                    setAmountUsd('50');
                  }}
                  className="py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Ajukan Penarikan Baru
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/transactions')}
                  className="py-2.5 px-5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow"
                >
                  Lihat Riwayat Transaksi
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleWithdraw} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Source account */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">
                  Akun Trading Sumber
                </label>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-neutral-900 font-mono">
                      #{primaryAccount?.accountNumber || '205128182'}
                    </strong>
                    <span className="text-neutral-500 block text-[11px]">
                      Cent news (1:1000)
                    </span>
                  </div>
                  <span className="text-emerald-700 font-bold font-mono text-sm">
                    Tersedia: ${primaryAccount?.balance.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* Method selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">
                  Saluran Penarikan
                </label>
                <select
                  value={selectedMethodId}
                  onChange={(e) => setSelectedMethodId(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-lg font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  {INDONESIA_PAYMENT_METHODS.map((pm) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.name} — ({pm.processingTime})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">
                  Nominal Penarikan (USD)
                </label>
                <input
                  type="number"
                  min="5"
                  step="any"
                  required
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-lg font-mono font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <span className="text-[11px] text-neutral-500 block">
                  Estimasi IDR: Rp {(parseFloat(amountUsd || '0') * 16000).toLocaleString('id-ID')}
                </span>
              </div>

              {/* Destination */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">
                  Nomor Rekening / Akun Tujuan & Atas Nama
                </label>
                <input
                  type="text"
                  required
                  value={destAccount}
                  onChange={(e) => setDestAccount(e.target.value)}
                  placeholder="Contoh: 123456789 a.n Ismail"
                  className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Memproses Penarikan...' : 'Ajukan Penarikan Dana'}
                <Zap className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Rules Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm space-y-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-900 font-bold border-b border-neutral-200 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Ketentuan Penarikan</span>
          </div>
          <p className="text-neutral-500 leading-relaxed text-[11px]">
            Penarikan dana diproses melalui saluran keuangan terverifikasi untuk menjamin keamanan dana trading Anda.
          </p>
          <div className="space-y-1.5 text-[11px] text-neutral-600">
            <div>• Minimal Penarikan: <strong>$5 USD</strong></div>
            <div>• Biaya Penarikan: <strong>Rp 0 (Bebas Biaya)</strong></div>
            <div>• Waktu Pemrosesan: <strong>Otomatis 1 - 15 Menit</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
