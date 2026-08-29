import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useStorage';
import { Eye, EyeOff, AlertCircle, Shield, Check, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(true);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setError('Harap masukkan email atau nomor telepon yang valid.');
      return;
    }
    if (!password) {
      setError('Harap masukkan kata sandi akun Anda.');
      return;
    }

    setError(null);
    setLoading(true);

    setTimeout(() => {
      const user = login(emailOrPhone.trim(), password);
      setLoading(false);

      if (user) {
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(from === '/login' ? '/dashboard' : from);
        }
      } else {
        setError('Email/Nomor telepon atau kata sandi tidak cocok. Silakan periksa kembali atau daftar akun baru.');
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-800 flex flex-col justify-between font-sans">
      {/* Top Mobile/Desktop Brand Bar */}
      <header className="bg-white border-b border-neutral-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white font-black text-xs mr-1.5 shadow-sm">
              N
            </span>
            <span className="font-black text-xl tracking-tight text-neutral-900">
              NEXORA<span className="text-red-600 font-bold ml-1">TRADE</span>
            </span>
          </div>
          <div className="h-4 w-px bg-neutral-300 mx-1.5" />
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
            Official Platform
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-neutral-100 px-2.5 py-1 rounded-md text-xs text-neutral-700 font-semibold border border-neutral-200">
            <span>🇮🇩</span>
            <span className="text-[11px] font-bold">ID / IDR</span>
          </div>
        </div>
      </header>

      {/* Main Login Card Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-neutral-200 p-6 sm:p-8 space-y-6">
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              Masuk ke Area Klien
            </h1>
            <p className="text-xs text-neutral-500">
              Akses akun trading, kelola saldo, dan buka posisi di Nexora WebTrader.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Email atau Nomor Telepon
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="nama@email.com atau 08123456789"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all placeholder:text-neutral-400 text-neutral-900"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-neutral-700">Kata Sandi</label>
                <Link to="/contact" className="text-red-600 hover:underline">
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi Anda"
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all placeholder:text-neutral-400 text-neutral-900"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-neutral-300 text-red-600 focus:ring-red-500"
                />
                <span>Ingat saya di perangkat ini</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Memverifikasi Akun...' : 'Masuk ke Portal Klien'}
            </button>
          </form>

          {/* Register Link */}
          <div className="pt-2 text-center text-xs text-neutral-600 border-t border-neutral-100">
            Belum memiliki akun Nexora Trade?{' '}
            <Link to="/register" className="text-red-600 font-bold hover:underline">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Links & Legal Disclaimers */}
      <footer className="bg-white border-t border-neutral-200 py-6 px-4 text-center text-xs text-neutral-500 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-4 text-neutral-700 font-medium">
          <Link to="/contact" className="hover:text-red-600">Hubungi Kami</Link>
          <span>|</span>
          <Link to="/privacy" className="hover:text-red-600">Kebijakan Privasi</Link>
          <span>|</span>
          <Link to="/terms" className="hover:text-red-600">Dokumentasi Legal</Link>
          <span>|</span>
          <Link to="/cookies" className="hover:text-red-600">Cookie</Link>
        </div>

        <p className="max-w-3xl mx-auto text-[10px] text-neutral-400 leading-relaxed pt-2">
          <strong>Legal:</strong> Nexora Trade Ltd didirikan di St. Vincent & the Grenadines sebagai Perusahaan Bisnis Internasional dengan nomor registrasi 22747 IBC 2015. Seluruh operasional Perusahaan sepenuhnya berpedoman pada regulasi finansial internasional.
        </p>
      </footer>

      {/* Cookie Consent Banner */}
      {showCookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-300 shadow-2xl p-4 sm:p-5">
          <div className="max-w-3xl mx-auto space-y-3">
            <h4 className="text-sm font-bold text-neutral-900">
              Situs web ini menggunakan cookie
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Nexora Trade menggunakan cookie untuk mengoptimalkan pengalaman trading, mempersonalisasi konten, dan menganalisis lalu lintas terminal kami secara aman.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowCookieConsent(false)}
                className="w-full sm:w-auto px-5 py-2 border border-neutral-300 hover:bg-neutral-100 rounded-lg text-xs font-bold text-neutral-800 uppercase tracking-wider transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => setShowCookieConsent(false)}
                className="w-full sm:w-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow cursor-pointer"
              >
                Setuju & Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
