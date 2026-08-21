import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useStorage';
import { Eye, EyeOff, AlertCircle, Check, Info, ChevronDown, Search, X } from 'lucide-react';

const COUNTRIES = [
  { name: 'Indonesia', code: 'ID', flag: '🇮🇩' },
  { name: 'Malaysia', code: 'MY', flag: '🇲🇾' },
  { name: 'Singapore', code: 'SG', flag: '🇸🇬' },
  { name: 'Vietnam', code: 'VN', flag: '🇻🇳' },
  { name: 'Thailand', code: 'TH', flag: '🇹🇭' },
  { name: 'Philippines', code: 'PH', flag: '🇵🇭' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  { name: 'Isle of Man', code: 'IM', flag: '🇮🇲' },
  { name: 'Israel', code: 'IL', flag: '🇮🇱' },
  { name: 'Ivory Coast', code: 'CI', flag: '🇨🇮' },
  { name: 'Jamaica', code: 'JM', flag: '🇯🇲' },
];

const LANGUAGES = [
  { name: 'English', flag: '🇬🇧' },
  { name: 'Français', flag: '🇫🇷' },
  { name: 'Indonesia', flag: '🇮🇩' },
  { name: 'Español', flag: '🇪🇸' },
  { name: 'Melayu', flag: '🇲🇾' },
  { name: 'Tagalog', flag: '🇵🇭' },
  { name: 'Tiếng Việt', flag: '🇻🇳' },
  { name: '한국어', flag: '🇰🇷' },
  { name: '日本語', flag: '🇯🇵' },
  { name: 'Português', flag: '🇵🇹' },
  { name: 'العربية', flag: '🇸🇦' },
  { name: 'हिन्दी', flag: '🇮🇳' },
];

export const RegisterPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[2]); // Indonesia

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [partnerCode, setPartnerCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password criteria validator
  const hasMinMaxLen = password.length >= 8 && password.length <= 15;
  const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const isPasswordValid = hasMinMaxLen && hasUpperLower && hasNumber && hasSpecial;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setError('Harap masukkan email atau nomor telepon Anda.');
      return;
    }
    if (!isPasswordValid) {
      setError('Harap lengkapi semua kriteria kata sandi yang diperlukan.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const isEmail = emailOrPhone.includes('@');
      const registered = register({
        name: emailOrPhone.split('@')[0],
        email: isEmail ? emailOrPhone : `${emailOrPhone}@nexoratrade.com`,
        phone: !isEmail ? emailOrPhone : '+6281298421109',
        country: selectedCountry.name,
        password,
      });

      setLoading(false);
      if (registered) {
        navigate('/dashboard');
      } else {
        setError('Email atau nomor telepon sudah terdaftar.');
      }
    }, 500);
  };

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-800 flex flex-col justify-between font-sans">
      {/* Top Header matching Nexora Trade */}
      <div className="bg-white border-b border-neutral-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
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
          {/* Language trigger button */}
          <button
            type="button"
            onClick={() => setLanguageModalOpen(true)}
            className="flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1.5 rounded text-xs text-neutral-700 font-semibold border border-neutral-200 cursor-pointer"
          >
            <span className="text-base">{selectedLang.flag}</span>
            <span className="hidden sm:inline">{selectedLang.name}</span>
            <ChevronDown className="w-3 h-3 text-neutral-500" />
          </button>
        </div>
      </div>

      {/* Main Registration Form Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-neutral-200 p-6 sm:p-8 space-y-5">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              Daftarkan akun Anda hari ini!
            </h1>
            <p className="text-xs text-neutral-600">
              Sudahkah memiliki akun?{' '}
              <Link to="/login" className="text-red-600 font-bold hover:underline">
                Gabung
              </Link>
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Country of Residence */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs font-semibold text-neutral-700">
                <span>Negara tempat tinggal</span>
                <Info className="w-3.5 h-3.5 text-neutral-400" />
              </div>
              <button
                type="button"
                onClick={() => setCountryModalOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-lg hover:border-neutral-400 transition-colors text-left cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{selectedCountry.flag}</span>
                  <span className="text-neutral-900 font-medium">{selectedCountry.name}</span>
                </span>
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            {/* Email or Phone */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-neutral-700">
                Email atau Nomor telepon
              </label>
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="nama@email.com atau 08123456789"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all text-neutral-900"
              />
            </div>

            {/* Password with live validator */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-neutral-700">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Buat kata sandi akun"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all text-neutral-900 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Checklist matching Video 1 */}
              <div className="pt-2 space-y-1.5 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                      hasMinMaxLen
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-neutral-400 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  <span className={hasMinMaxLen ? 'text-emerald-700 font-semibold' : ''}>
                    Antara 8 dan 15 karakter
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                      hasUpperLower
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-neutral-400 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  <span className={hasUpperLower ? 'text-emerald-700 font-semibold' : ''}>
                    Huruf besar dan huruf kecil
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                      hasNumber
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-neutral-400 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  <span className={hasNumber ? 'text-emerald-700 font-semibold' : ''}>
                    Setidaknya harus 1 angka
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                      hasSpecial
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-neutral-400 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  <span className={hasSpecial ? 'text-emerald-700 font-semibold' : ''}>
                    Setidaknya 1 karakter khusus
                  </span>
                </div>
              </div>
            </div>

            {/* Optional Partner Code */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-neutral-700">
                Kode Mitra (opsional)
              </label>
              <input
                type="text"
                value={partnerCode}
                onChange={(e) => setPartnerCode(e.target.value)}
                placeholder="Masukkan kode referral jika ada"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all text-neutral-900"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#15803d] hover:bg-[#166534] text-white font-bold text-sm rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Mendaftarkan Akun...' : 'Lanjutkan'}
            </button>
          </form>

          {/* Social Logins */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-neutral-200 w-full" />
            <span className="bg-white px-3 text-xs text-neutral-400 uppercase font-semibold">
              atau
            </span>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => {
                register({
                  name: 'Google Trader',
                  email: 'google.trader@nexoratrade.com',
                  phone: '+6281298421109',
                  country: 'Indonesia',
                });
                navigate('/dashboard');
              }}
              className="w-full py-2.5 px-4 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Lanjutkan dengan Google</span>
            </button>

            <button
              type="button"
              onClick={() => {
                register({
                  name: 'Apple Trader',
                  email: 'apple.trader@nexoratrade.com',
                  phone: '+6281298421109',
                  country: 'Indonesia',
                });
                navigate('/dashboard');
              }}
              className="w-full py-2.5 px-4 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.66-7.83-11.88-14.36-5.74-8.89-10.15-18.73-13.23-29.54-3.08-10.8-4.62-21.34-4.62-31.61 0-14.12 3.65-26.01 10.95-35.66 7.3-9.66 16.5-14.57 27.6-14.75 4.69 0 9.87 1.18 15.54 3.54 5.68 2.36 9.68 3.59 12.01 3.7 2.01 0 6.07-1.25 12.18-3.76 6.1-2.5 11.25-3.67 15.45-3.5 11.38.56 20.67 4.7 27.87 12.44-9.92 6.02-14.76 14.44-14.52 25.26.24 8.5 3.42 15.65 9.53 21.45 6.11 5.8 13.43 9.07 21.96 9.81-2.12 6.21-4.74 12.42-7.87 18.63zM119.22 33.02c0-7.39 2.65-14.15 7.95-20.27 5.3-6.13 11.83-9.9 19.6-11.32.78 7.62-1.74 14.55-7.55 20.78-5.81 6.23-12.47 9.84-20 10.81z" />
              </svg>
              <span>Lanjutkan dengan Apple</span>
            </button>
          </div>

          <p className="text-[11px] text-neutral-500 leading-relaxed text-center pt-2">
            Dengan mengklik 'Lanjutkan', Anda mengonfirmasi bahwa Anda berusia di atas 18 tahun dan mengakui bahwa Anda telah membaca dan menerima{' '}
            <Link to="/privacy" className="text-red-600 font-semibold underline">
              Kebijakan Privasi Perusahaan
            </Link>
            .
          </p>

          <div className="pt-2 text-center text-xs text-neutral-700">
            Daftar sebagai{' '}
            <span className="text-red-600 font-bold cursor-pointer hover:underline">
              Korporat
            </span>{' '}
            atau{' '}
            <span className="text-red-600 font-bold cursor-pointer hover:underline">
              Bersama
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-6 px-4 text-center text-xs text-neutral-500 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-4 text-neutral-700 font-medium">
          <Link to="/contact" className="hover:text-red-600">Hubungi Kami</Link>
          <span>|</span>
          <Link to="/privacy" className="hover:text-red-600">Kebijakan Privasi</Link>
          <span>|</span>
          <Link to="/terms" className="hover:text-red-600">Dokumentasi Legal</Link>
          <span>|</span>
          <Link to="/cookies" className="hover:text-red-600">Kue kering</Link>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2 text-neutral-400">
          <span className="hover:text-neutral-700 cursor-pointer">Facebook</span>
          <span>•</span>
          <span className="hover:text-neutral-700 cursor-pointer">X</span>
          <span>•</span>
          <span className="hover:text-neutral-700 cursor-pointer">Telegram</span>
          <span>•</span>
          <span className="hover:text-neutral-700 cursor-pointer">Instagram</span>
          <span>•</span>
          <span className="hover:text-neutral-700 cursor-pointer">YouTube</span>
          <span>•</span>
          <span className="hover:text-neutral-700 cursor-pointer">LinkedIn</span>
        </div>

        <p className="max-w-3xl mx-auto text-[10px] text-neutral-400 leading-relaxed pt-2">
          <strong>Hukum:</strong> Nexora Trade Ltd didirikan di St. Vincent & the Grenadines sebagai Perusahaan Bisnis Internasional dengan nomor registrasi 22747 IBC 2015. Seluruh objek Perusahaan beroperasi di bawah standar broker finansial global.
        </p>
      </footer>

      {/* Country Selector Modal */}
      {countryModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">Pilih Negara</h3>
              <button
                type="button"
                onClick={() => setCountryModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                placeholder="Cari..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1">
              {filteredCountries.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setSelectedCountry(c);
                    setCountryModalOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs hover:bg-neutral-100 transition-colors ${
                    selectedCountry.code === c.code ? 'bg-neutral-100 font-bold' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{c.flag}</span>
                    <span className="text-neutral-800">{c.name}</span>
                  </span>
                  {selectedCountry.code === c.code && (
                    <Check className="w-4 h-4 text-emerald-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Language Selector Modal (as seen in Video 1) */}
      {languageModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">Pilih Bahasa / Language</h3>
              <button
                type="button"
                onClick={() => setLanguageModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
              {LANGUAGES.map((l) => (
                <button
                  key={l.name}
                  type="button"
                  onClick={() => {
                    setSelectedLang(l);
                    setLanguageModalOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs hover:bg-neutral-100 transition-colors text-left ${
                    selectedLang.name === l.name ? 'bg-neutral-100 font-bold border border-emerald-600' : 'border border-neutral-200'
                  }`}
                >
                  <span className="text-base">{l.flag}</span>
                  <span className="text-neutral-800">{l.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
