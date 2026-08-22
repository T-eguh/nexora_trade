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
  Smartphone,
  Info,
  RefreshCw,
  Download,
} from 'lucide-react';

export const DepositPage: React.FC = () => {
  const { accounts } = useAccounts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const primaryAccount = accounts.find((a) => a.userId === user?.id) || accounts[0];

  // Fixed nominal: 500,000 IDR
  const [amountIdr, setAmountIdr] = useState<number>(500000);
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
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  // 1 USD = 16,000 IDR -> Rp 500,000 = $31.25 USD
  const usdEquiv = (amountIdr / 16000).toFixed(2);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmQrisPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Add balance to account in USD
      StorageService.deposit(
        primaryAccount.id,
        parseFloat(usdEquiv),
        `Setoran QRIS Instant Pay (Rp ${amountIdr.toLocaleString('id-ID')})`
      );

      setLoading(false);
      setSuccessReceipt({
        ref: `QRIS-${Date.now().toString().slice(-8)}`,
        amountIdr,
        amountUsd: usdEquiv,
        date: new Date().toLocaleString('id-ID'),
        accountNum: primaryAccount?.accountNumber || '205128182',
      });
    }, 850);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold tracking-wide uppercase">
            Metode Resmi: QRIS Instant Pay
          </span>
          <span className="text-xs text-neutral-500 font-medium">BCA, Mandiri, BRI, DANA, OVO, GoPay, ShopeePay</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
          Setoran Dana QRIS (Deposit)
        </h1>
        <p className="text-xs text-neutral-500">
          Lakukan deposit instan menggunakan kode QRIS Standar Bank Indonesia. Saldo trading akan otomatis terisi dalam mata uang <strong>USD ($)</strong>.
        </p>
      </div>

      {successReceipt ? (
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
              onClick={() => setSuccessReceipt(null)}
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: QRIS Barcode Card */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-5 text-center">
            {/* QRIS Header Banner */}
            <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white p-3.5 rounded-xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-wider">QRIS</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                  National Pay
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono bg-black/20 px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-bold text-amber-300">{formatTimer(timeLeft)}</span>
              </div>
            </div>

            {/* Merchant Info */}
            <div className="space-y-0.5">
              <h3 className="font-bold text-neutral-900 text-sm">NEXORA TRADE INDONESIA</h3>
              <p className="text-[11px] font-mono text-neutral-500">NMID: ID102039481920</p>
            </div>

            {/* Authentic QR Code Rendering */}
            <div className="p-4 bg-white border-2 border-dashed border-neutral-300 rounded-2xl inline-block shadow-inner relative group">
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

                {/* QR Data Grid Dots & Sync Lines */}
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

                {/* Center Badge Icon */}
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
                <span>QRIS Dinamis • Nominal Pas Rp {amountIdr.toLocaleString('id-ID')}</span>
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

          {/* Right Column: Deposit Form & Conversion details */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Nominal Deposit
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-neutral-900 font-mono">
                    Rp {amountIdr.toLocaleString('id-ID')}
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
                    Kredit Masuk ke Akun Trading (USD):
                  </span>
                  <span className="text-base font-black text-emerald-700 font-mono">
                    +${usdEquiv} USD
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-800/80 pt-1 border-t border-emerald-200/60">
                  <span>Kurs Konversi Tetap:</span>
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
                  Cara Pembayaran via QRIS:
                </span>
                <ol className="list-decimal pl-4 space-y-1 text-[11px] text-neutral-600 leading-relaxed">
                  <li>Buka aplikasi m-Banking (BCA, Mandiri, BRI, BNI) atau E-Wallet (DANA, OVO, GoPay, ShopeePay).</li>
                  <li>Pilih menu <strong>Pindai / Scan QRIS</strong>.</li>
                  <li>Arahkan kamera ke barcode QRIS di samping dan konfirmasi nominal <strong>Rp 500.000</strong>.</li>
                  <li>Setelah transfer berhasil, klik tombol verifikasi di bawah ini.</li>
                </ol>
              </div>

              {/* Submit / Confirmation Button */}
              <button
                type="button"
                disabled={loading}
                onClick={handleConfirmQrisPayment}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Memverifikasi Penerimaan QRIS...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Saya Sudah Bayar via QRIS (Rp {amountIdr.toLocaleString('id-ID')})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
