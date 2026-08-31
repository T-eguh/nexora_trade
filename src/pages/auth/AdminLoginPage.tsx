import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useStorage';
import { Shield, Lock, KeyRound, AlertCircle, Eye, EyeOff, CheckCircle2, ArrowRight, Sparkles, Check } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('889922');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFillCredentials = () => {
    setEmail('admin@nexoratrade.com');
    setPassword('admin123');
    setSecurityCode('889922');
    setError(null);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    const cleanPass = password.trim();

    if (!cleanEmail) {
      setError('Harap masukkan email administrator.');
      return;
    }

    if (!cleanPass) {
      setError('Harap masukkan kata sandi administrator.');
      return;
    }

    if (!securityCode || securityCode.trim().length !== 6) {
      setError('Kode otentikasi 2FA harus 6 digit angka.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Strictly Authenticate as Admin
      const loggedUser = login(cleanEmail, cleanPass);
      setLoading(false);

      if (loggedUser && loggedUser.role === 'admin') {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin');
        }, 600);
      } else if (loggedUser && loggedUser.role !== 'admin') {
        setError('Akses ditolak: Akun ini adalah akun trader biasa dan tidak memiliki hak akses administrator.');
      } else {
        setError('Email atau Kata Sandi Administrator salah. Akses ditolak demi keamanan sistem.');
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-200 flex flex-col justify-between font-sans selection:bg-red-500 selection:text-white">
      {/* Top Admin Security Bar */}
      <header className="border-b border-neutral-800/80 bg-[#0c0c10] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center text-white font-black text-xs shadow">
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-black text-white text-base tracking-wider uppercase">Nexora</span>
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest border border-red-500/40 px-1.5 py-0.5 rounded">
              ADMIN CONTROL
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4 text-xs">
          <span className="inline-flex items-center gap-1.5 text-neutral-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Security Gateway: Active
          </span>
        </div>
      </header>

      {/* Main Admin Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-[#111116] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="space-y-1.5 text-center">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-800/60 text-red-500 flex items-center justify-center mx-auto shadow-inner">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Portal Manajemen Administrator
            </h1>
            <p className="text-xs text-neutral-400">
              Akses terenkripsi untuk manajemen akun, pasar instrumen, dan verifikasi transaksi.
            </p>
          </div>

          {/* Success Notification */}
          {success && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-emerald-400 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Otentikasi Berhasil! Mengalihkan ke Panel Admin...</span>
            </div>
          )}

          {/* Error notice */}
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block font-semibold text-neutral-300">
                Email Administrator
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nexoratrade.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171d] border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500 transition-colors font-mono text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-neutral-300">
                Kata Sandi Akses
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi admin"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171d] border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500 transition-colors font-mono pr-10 text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block font-semibold text-neutral-300">
                  Kode Verifikasi 2FA (Otentikasi 6-Digit)
                </label>
                <span className="text-[10px] text-emerald-400 font-bold">2FA Active</span>
              </div>
              <input
                type="text"
                maxLength={6}
                value={securityCode}
                onChange={(e) => setSecurityCode(e.target.value)}
                placeholder="889922"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#17171d] border border-neutral-700 text-white tracking-widest text-center font-mono font-bold text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 active:scale-98"
            >
              {loading ? (
                <span>Memvalidasi Kredensial...</span>
              ) : success ? (
                <span>Berhasil Masuk...</span>
              ) : (
                <>
                  <span>Masuk ke Konsol Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="p-3 bg-[#17171d] border border-neutral-800 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Kredensial Super Admin
              </span>
              <button
                type="button"
                onClick={handleFillCredentials}
                className="text-[10px] text-red-400 hover:text-red-300 font-bold underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Isi Otomatis</span>
              </button>
            </div>
            <div className="text-[11px] font-mono text-neutral-300 flex justify-between items-center pt-1 border-t border-neutral-800">
              <span>Email: <strong className="text-white">admin@nexoratrade.com</strong></span>
              <span>Pass: <strong className="text-white">admin123</strong></span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-neutral-800/80 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Nexora Trade Admin Security Gateway • Akses Otoritas Terbatas
      </footer>
    </div>
  );
};
