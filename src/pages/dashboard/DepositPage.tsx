import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts, useAuth } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import { INDONESIA_PAYMENT_METHODS, PaymentMethod } from '../../data/payments';
import {
  ArrowDownCircle,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Building2,
  Smartphone,
  QrCode,
  CreditCard,
  Copy,
  Check,
} from 'lucide-react';

export const DepositPage: React.FC = () => {
  const { accounts } = useAccounts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const primaryAccount = accounts.find((a) => a.userId === user?.id) || accounts[0];

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(INDONESIA_PAYMENT_METHODS[0]);
  const [amountIdr, setAmountIdr] = useState('500000');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);

  // Conversion rate for USD equivalent demo credit (e.g. 1 USD = 16,000 IDR or 100 Cent)
  const idrNum = parseFloat(amountIdr) || 0;
  const usdEquiv = (idrNum / 16000).toFixed(2);
  const centEquiv = (parseFloat(usdEquiv) * 100).toFixed(2);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idrNum < selectedMethod.minDeposit) {
      alert(`Minimal deposit untuk metode ini adalah Rp ${selectedMethod.minDeposit.toLocaleString('id-ID')}`);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Add balance to account (in USD value)
      StorageService.deposit(
        primaryAccount.id,
        parseFloat(usdEquiv),
        `Setoran ${selectedMethod.name} (Rp ${idrNum.toLocaleString('id-ID')})`
      );

      setLoading(false);
      setSuccessReceipt({
        method: selectedMethod.name,
        amountIdr: idrNum,
        amountUsd: usdEquiv,
        cent: centEquiv,
        ref: `DEP-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleString('id-ID'),
      });
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            GERBANG PEMBAYARAN INDONESIA
          </span>
          <span className="text-xs text-neutral-500">Proses Cepat & Otomatis</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
          Setoran Dana (Deposit)
        </h1>
        <p className="text-xs text-neutral-500">
          Pilih saluran pembayaran lokal Indonesia untuk mendanai akun trading Anda secara instan.
        </p>
      </div>

      {successReceipt ? (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-neutral-900">Setoran Berhasil Dikreditkan!</h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Dana telah otomatis masuk ke akun trading #{primaryAccount?.accountNumber}.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs space-y-2 text-left">
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-500">No. Referensi:</span>
              <strong className="font-mono text-neutral-900">{successReceipt.ref}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-500">Metode Pembayaran:</span>
              <strong className="text-neutral-900">{successReceipt.method}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-500">Nominal IDR:</span>
              <strong className="text-neutral-900 font-mono">
                Rp {successReceipt.amountIdr.toLocaleString('id-ID')}
              </strong>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-500">Kredit USD / Cent:</span>
              <strong className="text-emerald-700 font-mono font-bold">
                +${successReceipt.amountUsd} USD (c{successReceipt.cent})
              </strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">Waktu Transaksi:</span>
              <span className="text-neutral-700">{successReceipt.date}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setSuccessReceipt(null)}
              className="py-2.5 px-5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Setor Lagi
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="py-2.5 px-6 bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs rounded-lg transition-colors shadow cursor-pointer"
            >
              Buka WebTrader
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Channel Selection */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200 shadow-sm space-y-4">
            <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
              1. Pilih Saluran Pembayaran
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {INDONESIA_PAYMENT_METHODS.map((pm) => {
                const isSelected = selectedMethod.id === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setSelectedMethod(pm)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: pm.logoColor || '#333' }}
                      >
                        {pm.logoText}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <strong className="text-xs text-neutral-900 truncate block">
                            {pm.name}
                          </strong>
                        </div>
                        <span className="text-[10px] text-neutral-500 block">
                          Biaya: {pm.fee} • {pm.processingTime}
                        </span>
                      </div>
                    </div>

                    {pm.badge && (
                      <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded shrink-0">
                        {pm.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Step 2: Payment Details Form */}
            <form onSubmit={handleDeposit} className="pt-3 border-t border-neutral-200 space-y-4">
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                2. Masukkan Nominal Setoran
              </label>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span>Nominal IDR (Rupiah)</span>
                  <span className="text-[11px] text-neutral-500">
                    Min: Rp {selectedMethod.minDeposit.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    step="50000"
                    required
                    value={amountIdr}
                    onChange={(e) => setAmountIdr(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 text-neutral-900 font-mono"
                  />
                </div>
              </div>

              {/* Quick Amount Pills */}
              <div className="flex flex-wrap gap-1.5">
                {[100000, 250000, 500000, 1000000, 2500000, 5000000].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setAmountIdr(quick.toString())}
                    className="px-2.5 py-1 text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-md border border-neutral-200 cursor-pointer"
                  >
                    Rp {quick.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>

              {/* Equivalent Conversion Card */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px]">Estimasi Nilai Kredit Akun</span>
                  <strong className="text-neutral-900 font-mono text-sm">
                    ${usdEquiv} USD (c{centEquiv} Cent)
                  </strong>
                </div>
                <span className="text-[10px] text-neutral-400">Kurs Acuan: 1 USD = Rp 16.000</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs rounded-lg transition-colors shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Memproses Setoran...' : `Lanjutkan Pembayaran via ${selectedMethod.name}`}
                <Zap className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right: Payment Instructions & Virtual Account */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm space-y-3.5 text-xs">
              <div className="flex items-center gap-2 text-neutral-900 font-bold border-b border-neutral-200 pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Instruksi Transfer Saluran</span>
              </div>

              <div className="space-y-2">
                <span className="text-neutral-500 block text-[11px]">Nama Rekening / Merchant Tujuan:</span>
                <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 font-bold text-neutral-900">
                  {selectedMethod.accountName}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-neutral-500 block text-[11px]">Nomor Rekening / Virtual Account / Address:</span>
                <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                  <span className="font-mono font-bold text-neutral-900 text-xs truncate mr-2">
                    {selectedMethod.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedMethod.accountNumber || '')}
                    className="p-1 text-neutral-500 hover:text-emerald-700 transition-colors"
                    title="Salin Nomor"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200 space-y-1.5 text-[11px] text-neutral-500">
                <div>• Biaya Admin: <strong>Rp 0 (Gratis)</strong></div>
                <div>• Waktu Pemrosesan: <strong>{selectedMethod.processingTime}</strong></div>
                <div>• Pembayaran diverifikasi otomatis 24 jam nonstop</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
