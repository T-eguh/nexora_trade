import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import {
  Shield,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Check,
  User,
} from 'lucide-react';
import { useAuth } from '../../hooks/useStorage';
import { StorageService } from '../../utils/storage';

export const SecurityPage: React.FC = () => {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled || false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-neutral-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Lemah', color: 'bg-red-500' };
    if (score === 2) return { score: 2, label: 'Cukup', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Baik', color: 'bg-blue-500' };
    return { score: 4, label: 'Sangat Kuat', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(newPassword);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!newPassword || newPassword.length < 6) {
      setError('Kata sandi baru minimal harus terdiri dari 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi kata sandi baru tidak cocok. Pastikan kedua kolom sama.');
      return;
    }

    if (user?.password && currentPassword && user.password !== currentPassword) {
      setError('Kata sandi saat ini tidak sesuai. Silakan periksa kembali.');
      return;
    }

    if (!user) return;

    setLoading(true);

    setTimeout(() => {
      StorageService.updateUser(user.id, {
        password: newPassword,
      });

      setLoading(false);
      setSuccessMsg('Kata sandi akun Anda berhasil diperbarui dan disimpan!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(null), 4000);
    }, 500);
  };

  const toggle2FA = () => {
    if (!user) return;
    const nextVal = !twoFactor;
    setTwoFactor(nextVal);
    StorageService.updateUser(user.id, { twoFactorEnabled: nextVal });
    setSuccessMsg(
      nextVal
        ? 'Otentikasi Dua Faktor (2FA) berhasil diaktifkan untuk akun Anda.'
        : 'Otentikasi Dua Faktor (2FA) dinonaktifkan.'
    );
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold tracking-wide uppercase">
            Keamanan Akun Klien
          </span>
          <span className="text-xs text-neutral-500 font-mono">ID: {user?.id || 'USR-2051'}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
          Pengaturan & Ganti Kata Sandi
        </h1>
        <p className="text-xs text-neutral-500">
          Kelola kata sandi masuk akun Anda, otentikasi dua langkah, dan proteksi keamanan trading.
        </p>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-3 shadow-sm animate-fadeIn">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs sm:text-sm font-medium flex items-center gap-3 shadow-sm animate-fadeIn">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Change Password Card */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Ubah Kata Sandi Masuk
                </h2>
                <p className="text-xs text-neutral-500">
                  Perbarui kata sandi secara berkala untuk menjaga keamanan akun Anda.
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs sm:text-sm">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="block text-neutral-700 font-semibold text-xs">
                  Kata Sandi Saat Ini
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="Masukkan kata sandi lama Anda"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all font-mono text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-neutral-700 font-semibold text-xs">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4 text-red-500" />
                  </div>
                  <input
                    type={showNew ? 'text' : 'password'}
                    placeholder="Minimal 6 karakter kombinasi"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all font-mono text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Strength Meter */}
                {newPassword && (
                  <div className="pt-1 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500">Kekuatan Sandi:</span>
                      <span className="font-bold text-neutral-700">{strength.label}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1.5">
                      <div
                        className={`rounded-full ${
                          strength.score >= 1 ? strength.color : 'bg-neutral-200'
                        }`}
                      />
                      <div
                        className={`rounded-full ${
                          strength.score >= 2 ? strength.color : 'bg-neutral-200'
                        }`}
                      />
                      <div
                        className={`rounded-full ${
                          strength.score >= 3 ? strength.color : 'bg-neutral-200'
                        }`}
                      />
                      <div
                        className={`rounded-full ${
                          strength.score >= 4 ? strength.color : 'bg-neutral-200'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="block text-neutral-700 font-semibold text-xs">
                  Konfirmasi Kata Sandi Baru
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4 text-red-500" />
                  </div>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Ulangi kata sandi baru Anda"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all font-mono text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'Menyimpan Kata Sandi...' : 'Simpan Perubahan Kata Sandi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: 2FA & Account Protection Info */}
        <div className="lg:col-span-5 space-y-5">
          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-neutral-100">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Otentikasi Dua Faktor (2FA)
                </h3>
                <span className="text-[11px] text-neutral-500">Lapisan Pengamanan Ekstra</span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              Membutuhkan konfirmasi kode verifikasi saat login atau saat mengajukan permintaan penarikan dana sensitif.
            </p>

            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-neutral-900 block">
                  Status: {twoFactor ? 'AKTIF' : 'NON-AKTIF'}
                </span>
                <span className="text-[10px] text-neutral-500">
                  {twoFactor ? 'Kode SMS / App OTP Aktif' : 'Hanya proteksi kata sandi'}
                </span>
              </div>

              <button
                type="button"
                onClick={toggle2FA}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                  twoFactor
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {twoFactor ? 'Matikan 2FA' : 'Aktifkan 2FA'}
              </button>
            </div>
          </div>

          {/* Tips Keamanan Akun */}
          <div className="bg-neutral-900 text-white rounded-2xl p-5 border border-neutral-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
              <Shield className="w-4 h-4" />
              <span>Panduan Keamanan Nexora Trade</span>
            </div>
            <ul className="text-[11px] text-neutral-300 space-y-2 leading-relaxed list-disc list-inside">
              <li>Jangan pernah membagikan kata sandi Anda kepada siapa pun termasuk staf support.</li>
              <li>Gunakan kombinasi huruf kapital, angka, dan simbol untuk keamanan maksimal.</li>
              <li>Pastikan nomor WhatsApp dan email terdaftar selalu dalam kondisi aktif.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
