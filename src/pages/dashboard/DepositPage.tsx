import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts, useAuth } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  Clock,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Info,
  Wallet,
  AlertTriangle,
  X,
} from 'lucide-react';

export const DepositPage: React.FC = () => {
  const { accounts } = useAccounts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const primaryAccount = accounts.find((a) => a.userId === user?.id) || accounts[0];

  // Steps: 'input' -> 'qris' -> 'success'
  const [step, setStep] = useState<'input' | 'qris' | 'success'>('input');
  const [amountInput, setAmountInput] = useState<string>('500000');
  const [confirmedAmount, setConfirmedAmount] = useState<number>(500000);
  const [showMinDepositModal, setShowMinDepositModal] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<{
    ref: string;
    amountIdr: number;
    amountUsd: string;
    date: string;
    accountNum: string;
  } | null>(null);

  // Expiry countdown timer (15 minutes)
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'qris') {
      setTimeLeft(15 * 60);
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  const parsedAmount = parseInt(amountInput.replace(/\D/g, ''), 10) || 0;
  // Fixed exchange rate: 1 USD = 16,000 IDR
  const previewUsd = (parsedAmount / 16000).toFixed(2);
  const confirmedUsd = (confirmedAmount / 16000).toFixed(2);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInitiateDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(amountInput.replace(/\D/g, ''), 10) || 0;

    // Check minimum deposit requirement (500,000 IDR)
    if (val < 500000) {
      setShowMinDepositModal(true);
      return;
    }

    setConfirmedAmount(val);
    setStep('qris');
  };

  const handleSetExact500k = () => {
    setAmountInput('500000');
    setConfirmedAmount(500000);
    setShowMinDepositModal(false);
    setStep('qris');
  };

  const handleConfirmQrisPayment = () => {
    setLoading(true);
    setTimeout(() => {
      // Add balance in USD
      StorageService.deposit(
        primaryAccount?.id || 'acc-1',
        parseFloat(confirmedUsd),
        `Setoran QRIS Instant Pay (Rp ${confirmedAmount.toLocaleString('id-ID')})`
      );

      setLoading(false);
      setSuccessReceipt({
        ref: `QRIS-${Date.now().toString().slice(-8)}`,
        amountIdr: confirmedAmount,
        amountUsd: confirmedUsd,
        date: new Date().toLocaleString('id-ID'),
        accountNum: primaryAccount?.accountNumber || '205128182',
      });
      setStep('success');
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header Bar */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold tracking-wide uppercase">
            Deposit QRIS Instant Pay
          </span>
          <span className="text-xs text-neutral-500 font-medium">BCA, Mandiri, BRI, BNI, DANA, OVO, GoPay, ShopeePay</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
          Setoran Dana (Deposit)
        </h1>
        <p className="text-xs text-neutral-500">
          Deposit saldo trading Anda secara instan menggunakan QRIS Standar Bank Indonesia. Saldo akan otomatis terkonversi dan dikreditkan dalam mata uang <strong>USD ($)</strong>.
        </p>
      </div>

      {/* STEP 1: INPUT NOMINAL & METODE PEMBAYARAN */}
      {step === 'input' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Deposit Form Card */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200 shadow-sm space-y-6">
            <form onSubmit={handleInitiateDeposit} className="space-y-5">
              {/* Manual Nominal Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Nominal Deposit (IDR)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold font-mono text-neutral-500 text-base">
                    Rp
                  </span>
                  <input
                    type="number"
                    required
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder="Contoh: 500000"
                    className="w-full pl-12 pr-28 py-3.5 rounded-xl border border-neutral-300 font-mono font-bold text-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-xs"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-mono font-bold">
                    ≈ ${previewUsd} USD
                  </div>
                </div>

                {/* Keterangan Minimal 500ribu */}
                <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  <Info className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>* Keterangan: Minimal deposit adalah Rp 500.000</span>
                </div>
              </div>

              {/* Quick Nominal Selector Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Pilihan Nominal Cepat:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[500000, 1000000, 2500000, 5000000, 10000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmountInput(amt.toString())}
                      className={`py-2 px-2 text-xs font-bold font-mono rounded-xl border transition-all cursor-pointer text-center ${
                        parsedAmount === amt
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      Rp {(amt / 1000).toLocaleString('id-ID')}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Pilihan Metode Pembayaran: QRIS */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Pilihan Metode Pembayaran:
                </label>
                <div className="p-4 bg-red-50/50 border-2 border-red-500 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                      QRIS
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-neutral-900">QRIS Instant Pay</strong>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Otomatis
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Semua Bank (BCA, Mandiri, BRI, BNI) & E-Wallet (DANA, OVO, GoPay, ShopeePay)
                      </p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Action Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Deposit Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm space-y-4 text-xs">
              <h3 className="font-bold text-neutral-900 pb-2 border-b border-neutral-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Informasi Akun Trading</span>
              </h3>

              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Akun Penerima:</span>
                  <strong className="text-neutral-900 font-mono">
                    #{primaryAccount?.accountNumber || '205128182'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Mata Uang Akun:</span>
                  <strong className="text-neutral-900 font-mono">USD ($)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Biaya Transaksi:</span>
                  <strong className="text-emerald-600 font-bold">Gratis (Rp 0)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Kurs Konversi:</span>
                  <strong className="text-neutral-700 font-mono">1 USD = Rp 16.000</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Server:</span>
                  <strong className="text-neutral-800 font-mono text-[11px]">US New York Live</strong>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-600 leading-relaxed">
                Deposit diproses secara instan 24/7. Saldo langsung siap digunakan untuk trading di WebTrader.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: TAMPILAN BARCODE QRIS DINAMIS */}
      {step === 'qris' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          {/* Left Column: QRIS Barcode Card */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-5 text-center">
            {/* Top Back and Timer Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-1 font-bold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Ubah Nominal</span>
              </button>
              <div className="flex items-center gap-1.5 text-xs font-mono bg-red-50 text-red-700 px-2.5 py-1 rounded-lg border border-red-200">
                <Clock className="w-3.5 h-3.5 text-red-600" />
                <span className="font-bold">{formatTimer(timeLeft)}</span>
              </div>
            </div>

            {/* QRIS Header Banner */}
            <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white p-3 rounded-xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-wider">QRIS</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                  National Pay
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold bg-black/20 px-2 py-0.5 rounded">
                Rp {confirmedAmount.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Merchant Info */}
            <div className="space-y-0.5">
              <h3 className="font-bold text-neutral-900 text-sm">NEXORA TRADE INDONESIA</h3>
              <p className="text-[11px] font-mono text-neutral-500">NMID: ID102039481920</p>
            </div>

            {/* Authentic QR Code SVG */}
            <div className="p-4 bg-white border-2 border-dashed border-neutral-300 rounded-2xl inline-block shadow-inner relative">
              <svg
                viewBox="0 0 220 220"
                className="w-48 h-48 sm:w-56 sm:h-56 mx-auto text-neutral-900"
                fill="currentColor"
              >
                {/* QR Finder Pattern Top-Left */}
                <rect x="10" y="10" width="60" height="60" fill="currentColor" rx="4" />
                <rect x="20" y="20" width="40" height="40" fill="white" rx="2" />
                <rect x="30" y="30" width="20" height="20" fill="currentColor" rx="1" />

                {/* QR Finder Pattern Top-Right */}
                <rect x="150" y="10" width="60" height="60" fill="currentColor" rx="4" />
                <rect x="160" y="20" width="40" height="40" fill="white" rx="2" />
                <rect x="170" y="30" width="20" height="20" fill="currentColor" rx="1" />

                {/* QR Finder Pattern Bottom-Left */}
                <rect x="10" y="150" width="60" height="60" fill="currentColor" rx="4" />
                <rect x="20" y="160" width="40" height="40" fill="white" rx="2" />
                <rect x="30" y="170" width="20" height="20" fill="currentColor" rx="1" />

                {/* QR Data Grid Dots */}
                <rect x="80" y="15" width="10" height="10" fill="currentColor" />
                <rect x="100" y="15" width="10" height="10" fill="currentColor" />
                <rect x="120" y="15" width="10" height="10" fill="currentColor" />
                <rect x="80" y="35" width="10" height="10" fill="currentColor" />
                <rect x="110" y="35" width="10" height="10" fill="currentColor" />
                <rect x="130" y="35" width="10" height="10" fill="currentColor" />
                <rect x="90" y="55" width="10" height="10" fill="currentColor" />
                <rect x="120" y="55" width="10" height="10" fill="currentColor" />

                <rect x="15" y="80" width="10" height="10" fill="currentColor" />
                <rect x="35" y="80" width="10" height="10" fill="currentColor" />
                <rect x="55" y="80" width="10" height="10" fill="currentColor" />
                <rect x="75" y="80" width="10" height="10" fill="currentColor" />
                <rect x="95" y="80" width="10" height="10" fill="currentColor" />
                <rect x="115" y="80" width="10" height="10" fill="currentColor" />
                <rect x="135" y="80" width="10" height="10" fill="currentColor" />
                <rect x="155" y="80" width="10" height="10" fill="currentColor" />
                <rect x="175" y="80" width="10" height="10" fill="currentColor" />
                <rect x="195" y="80" width="10" height="10" fill="currentColor" />

                <rect x="75" y="100" width="10" height="10" fill="currentColor" />
                <rect x="105" y="100" width="10" height="10" fill="currentColor" />
                <rect x="125" y="100" width="10" height="10" fill="currentColor" />
                <rect x="145" y="100" width="10" height="10" fill="currentColor" />

                <rect x="80" y="125" width="10" height="10" fill="currentColor" />
                <rect x="100" y="125" width="10" height="10" fill="currentColor" />
                <rect x="130" y="125" width="10" height="10" fill="currentColor" />
                <rect x="160" y="125" width="10" height="10" fill="currentColor" />
                <rect x="190" y="125" width="10" height="10" fill="currentColor" />

                <rect x="80" y="150" width="10" height="10" fill="currentColor" />
                <rect x="110" y="150" width="10" height="10" fill="currentColor" />
                <rect x="140" y="150" width="10" height="10" fill="currentColor" />
                <rect x="170" y="150" width="10" height="10" fill="currentColor" />
                <rect x="200" y="150" width="10" height="10" fill="currentColor" />

                <rect x="85" y="175" width="10" height="10" fill="currentColor" />
                <rect x="105" y="175" width="10" height="10" fill="currentColor" />
                <rect x="135" y="175" width="10" height="10" fill="currentColor" />
                <rect x="155" y="175" width="10" height="10" fill="currentColor" />
                <rect x="185" y="175" width="10" height="10" fill="currentColor" />

                {/* Center Badge */}
                <rect x="88" y="88" width="44" height="44" fill="white" rx="6" />
                <rect x="92" y="92" width="36" height="36" fill="#dc2626" rx="4" />
                <text
                  x="110"
                  y="115"
                  fill="white"
                  fontSize="14"
                  fontWeight="900"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  N
                </text>
              </svg>

              <div className="mt-2 text-[11px] font-bold text-neutral-700 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>QRIS Dinamis • Nominal Pas Rp {confirmedAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleCopy('ID102039481920')}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'NMID Disalin' : 'Salin NMID'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Confirmation & Instructions */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Total Pembayaran
                  </span>
                  <div className="text-2xl font-black text-neutral-900 font-mono">
                    Rp {confirmedAmount.toLocaleString('id-ID')}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                  Biaya Admin: Rp 0
                </span>
              </div>

              {/* Conversion card to USD */}
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-900">
                    Kredit Saldo Masuk ke Akun Trading (USD):
                  </span>
                  <span className="text-lg font-black text-emerald-700 font-mono">
                    +${confirmedUsd} USD
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-800/80 pt-1 border-t border-emerald-200/60">
                  <span>Kurs Konversi:</span>
                  <span className="font-mono font-semibold">1 USD = Rp 16.000</span>
                </div>
              </div>

              {/* Account target info */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Akun Trading Penerima:</span>
                  <strong className="text-neutral-900 font-mono">
                    #{primaryAccount?.accountNumber || '205128182'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Mata Uang Akun:</span>
                  <strong className="text-neutral-900 font-mono">USD ($)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Server Trading:</span>
                  <strong className="text-neutral-800 font-mono text-[11px]">
                    US New York (Amerikan) Live
                  </strong>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-2 text-xs text-neutral-600">
                <span className="font-bold text-neutral-800 block text-[11px] uppercase tracking-wider">
                  Panduan Pembayaran QRIS:
                </span>
                <ol className="list-decimal pl-4 space-y-1 text-[11px] text-neutral-600 leading-relaxed">
                  <li>Buka aplikasi m-Banking (BCA, Mandiri, BRI, BNI) atau E-Wallet (DANA, OVO, GoPay, ShopeePay).</li>
                  <li>Pilih menu <strong>Pindai / Scan QRIS</strong>.</li>
                  <li>Arahkan kamera ke barcode QRIS di samping dan pastikan nominal sesuai <strong>Rp {confirmedAmount.toLocaleString('id-ID')}</strong>.</li>
                  <li>Setelah pembayaran berhasil, klik tombol di bawah untuk verifikasi instan.</li>
                </ol>
              </div>

              {/* Submit / Confirmation Button */}
              <button
                type="button"
                disabled={loading}
                onClick={handleConfirmQrisPayment}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Memverifikasi Penerimaan QRIS...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Saya Sudah Bayar via QRIS (Rp {confirmedAmount.toLocaleString('id-ID')})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: SUCCESS RECEIPT */}
      {step === 'success' && successReceipt && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-neutral-900">Pembayaran QRIS Terverifikasi!</h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Setoran sebesar <strong>Rp {successReceipt.amountIdr.toLocaleString('id-ID')}</strong> telah berhasil dikreditkan ke saldo akun trading Anda dalam mata uang <strong>USD</strong>.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-neutral-50 p-5 rounded-2xl border border-neutral-200 text-xs space-y-3 text-left">
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-500">No. Referensi:</span>
              <strong className="font-mono text-neutral-900">{successReceipt.ref}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-500">Metode Pembayaran:</span>
              <strong className="text-neutral-900">QRIS Standar Nasional</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-500">Akun Trading:</span>
              <strong className="text-neutral-900 font-mono">#{successReceipt.accountNum}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-500">Nominal Bayar (IDR):</span>
              <strong className="text-neutral-900 font-mono text-sm">
                Rp {successReceipt.amountIdr.toLocaleString('id-ID')}
              </strong>
            </div>
            <div className="flex justify-between py-1.5 bg-emerald-50 px-3 rounded-lg border border-emerald-200">
              <span className="text-emerald-800 font-medium">Kredit Saldo USD Masuk:</span>
              <strong className="text-emerald-700 font-mono font-black text-sm">
                +${successReceipt.amountUsd} USD
              </strong>
            </div>
            <div className="flex justify-between py-1 text-[11px] text-neutral-500">
              <span>Waktu Transaksi:</span>
              <span>{successReceipt.date}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setStep('input');
                setSuccessReceipt(null);
              }}
              className="py-2.5 px-5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Deposit QRIS Lagi
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/markets')}
              className="py-2.5 px-6 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors shadow cursor-pointer flex items-center gap-2"
            >
              <span>Buka WebTrader</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* POP UP PERINGATAN MINIMAL DEPOSIT 500RB */}
      {showMinDepositModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-neutral-200 shadow-2xl space-y-5 animate-scaleUp text-neutral-900 relative">
            <button
              type="button"
              onClick={() => setShowMinDepositModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 pt-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-neutral-900 tracking-tight">
                Peringatan Minimal Deposit
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed px-2">
                Nominal deposit minimal adalah <strong>Rp 500.000</strong>. Silakan masukkan nominal minimal Rp 500.000 untuk melanjutkan pembayaran via QRIS.
              </p>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex justify-between">
                <span>Nominal yang dimasukkan:</span>
                <strong className="font-mono text-red-600">Rp {parsedAmount.toLocaleString('id-ID')}</strong>
              </div>
              <div className="flex justify-between">
                <span>Minimal yang dibutuhkan:</span>
                <strong className="font-mono text-emerald-700">Rp 500.000 (+${(500000 / 16000).toFixed(2)} USD)</strong>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleSetExact500k}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Ubah ke Rp 500.000 & Lanjutkan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowMinDepositModal(false)}
                className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Tutup & Perbaiki Nominal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
